import { UserProfile } from './mockDb';

export interface InvoiceTransactionData {
  id: string;
  invoiceNumber?: string;
  itemName: string;
  planId?: string;
  price: number;
  originalPrice?: number;
  couponApplied?: string;
  discountAmount?: number;
  timestamp?: string | number;
  startDate?: string;
  expiresDate?: string;
  durationDays?: number;
  gateway?: string;
  paymentId?: string;
  orderId?: string;
  subscriptionId?: string;
  customerName?: string;
  customerEmail?: string;
  email?: string;
  status?: string;
}

/**
 * Loads an image from a URL or relative path into an HTMLImageElement and gets base64 / Image element
 */
const loadImageDataUrl = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          resolve(src);
        }
      } catch (err) {
        resolve(src);
      }
    };
    img.onerror = () => {
      resolve(src);
    };
    img.src = src;
  });
};

/**
 * Dynamically loads the jsPDF library from bundle or CDN fallback
 */
async function getJsPdfInstance(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only supported on the client side.');
  }

  // Check window global
  if ((window as any).jspdf?.jsPDF) {
    return (window as any).jspdf.jsPDF;
  }

  // Try dynamic import
  try {
    const jspdfModule = await import('jspdf');
    return jspdfModule.jsPDF || (jspdfModule as any).default?.jsPDF || (jspdfModule as any).default;
  } catch (e) {
    // If not in node_modules on runtime, load via fast CDN
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('jspdf-cdn-script');
      if (existingScript) {
        let retries = 0;
        const interval = setInterval(() => {
          if ((window as any).jspdf?.jsPDF) {
            clearInterval(interval);
            resolve((window as any).jspdf.jsPDF);
          } else if (retries++ > 30) {
            clearInterval(interval);
            reject(new Error('Failed to load jsPDF library'));
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = 'jspdf-cdn-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).jspdf?.jsPDF) {
          resolve((window as any).jspdf.jsPDF);
        } else {
          reject(new Error('jsPDF loaded but constructor not found.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load jsPDF from CDN.'));
      document.body.appendChild(script);
    });
  }
}

/**
 * Generates and downloads a clean, professional PDF Tax Invoice for CampusCV users.
 * 
 * Requirements:
 * - Logo: /Transperant (1).png (CampusCV official transparent logo)
 * - Attribution: "Powered by Infowaves Media Agency"
 * - Official Email: "support@campuscv.com"
 */
export async function downloadInvoicePdf(
  tx: InvoiceTransactionData,
  user?: UserProfile | null,
  portfolioUsername?: string
): Promise<void> {
  // 1. Calculate and normalize data
  const buyDateObj = tx.startDate 
    ? new Date(tx.startDate) 
    : (tx.timestamp ? new Date(tx.timestamp) : new Date());
  
  const buyDateStr = buyDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const buyTimeStr = buyDateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  let durationDays = tx.durationDays;
  if (!durationDays) {
    if (tx.itemName?.includes('365') || tx.planId?.includes('yearly')) durationDays = 365;
    else if (tx.itemName?.includes('90') || tx.planId?.includes('quarterly')) durationDays = 90;
    else if (tx.itemName?.includes('5') || tx.planId?.includes('test') || tx.planId?.includes('trial')) durationDays = 5;
    else durationDays = 30;
  }

  let expiresDateObj: Date;
  if (tx.expiresDate) {
    expiresDateObj = new Date(tx.expiresDate);
  } else {
    expiresDateObj = new Date(buyDateObj.getTime() + durationDays * 86400000);
  }
  const expiresDateStr = expiresDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const rawInvoiceNumber = tx.invoiceNumber || (tx.id.startsWith('INV-') ? tx.id : `INV-CCV-${buyDateObj.getFullYear()}-${tx.id.replace(/\D/g, '').slice(-5) || Math.floor(10000 + Math.random() * 90000)}`);
  
  const customerName = tx.customerName || user?.name || user?.email?.split('@')[0] || 'Valued Student / Professional';
  const customerEmail = tx.customerEmail || tx.email || user?.email || 'support@campuscv.com';
  const username = portfolioUsername || user?.email?.split('@')[0] || 'campuscv_user';
  
  const paymentId = tx.paymentId || (tx.id ? 'pay_' + tx.id.replace(/^tx-/, '') : 'RZP-ONLINE-VERIFIED');
  const orderId = tx.orderId || tx.subscriptionId || (tx.id ? 'ord_' + tx.id.replace(/^tx-/, '') : 'CCV-ORD-' + Date.now().toString().slice(-6));
  
  const originalPriceNum = tx.originalPrice ? Number(tx.originalPrice) : Number(tx.price);
  const paidPriceNum = Number(tx.price);
  const discountAmountNum = tx.discountAmount !== undefined 
    ? Number(tx.discountAmount) 
    : (originalPriceNum > paidPriceNum ? originalPriceNum - paidPriceNum : 0);

  // 2. Initialize dynamic jsPDF (A4 portrait: 210mm x 297mm)
  const JsPDFClass = await getJsPdfInstance();
  const doc = new JsPDFClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2); // 178mm

  // 3. Decorative top colored header bar (Modern Gradient Simulation)
  doc.setFillColor(79, 70, 229); // #4f46e5 (Indigo)
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(124, 58, 237); // #7c3aed (Purple accent line)
  doc.rect(0, 5, pageWidth, 1.5, 'F');

  let currentY = 16;

  // 4. Try loading logo image
  let logoLoaded = false;
  try {
    const logoBase64 = await loadImageDataUrl('/Transperant (1).png');
    if (logoBase64 && logoBase64.startsWith('data:image')) {
      // Aspect ratio for 950x228 = ~4.16 : 1
      const logoW = 55;
      const logoH = 13.5;
      doc.addImage(logoBase64, 'PNG', margin, currentY, logoW, logoH);
      logoLoaded = true;
    }
  } catch {
    logoLoaded = false;
  }

  // Fallback text if logo didn't render as image
  if (!logoLoaded) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('CampusCV', margin, currentY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('A SMARTER WAY TO BUILD YOUR RESUME', margin, currentY + 13);
  }

  // Invoice Title & Status Badge on Top Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text('TAX INVOICE', pageWidth - margin, currentY + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text(rawInvoiceNumber, pageWidth - margin, currentY + 10, { align: 'right' });

  // Paid Status Pill
  const pillW = 28;
  const pillH = 6.5;
  const pillX = pageWidth - margin - pillW;
  const pillY = currentY + 13;
  
  doc.setFillColor(220, 252, 231); // #dcfce7 (Light emerald)
  doc.roundedRect(pillX, pillY, pillW, pillH, 2, 2, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(pillX, pillY, pillW, pillH, 2, 2, 'D');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61); // #15803d
  doc.text('PAID & VERIFIED', pillX + (pillW / 2), pillY + 4.5, { align: 'center' });

  // Sub-header Agency & Contact Row
  currentY += 23;
  
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  
  currentY += 4.5;
  
  // Issuer details (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Issued by: CampusCV Technologies', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Powered by Infowaves Media Agency', margin, currentY + 4);
  doc.text('Official Support: support@campuscv.com  |  Web: https://campuscv.com', margin, currentY + 8);

  // Invoice Date & Mode (Right)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice Date: ${buyDateStr} ${buyTimeStr}`, pageWidth - margin, currentY, { align: 'right' });
  doc.text(`Payment Gateway: Razorpay Secured Online`, pageWidth - margin, currentY + 4, { align: 'right' });
  doc.text(`Status: Completed (INR)`, pageWidth - margin, currentY + 8, { align: 'right' });

  currentY += 14;

  // 5. Customer & Order Info Boxes (Side by Side Cards)
  const boxW = (contentWidth - 6) / 2;
  const boxH = 34;

  // Box 1: Billed To
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, boxW, boxH, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('BILLED TO (CUSTOMER)', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(customerName.slice(0, 32), margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email: ${customerEmail}`, margin + 4, currentY + 17.5);
  doc.text(`Portfolio Handle: @${username}`, margin + 4, currentY + 22.5);
  doc.text(`User ID: ${user?.id || 'CCV-' + (user?.email?.split('@')[0] || 'STUDENT')}`, margin + 4, currentY + 27.5);

  // Box 2: Payment & Order Info
  const box2X = margin + boxW + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(box2X, currentY, boxW, boxH, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('PAYMENT & TRANSACTION DETAILS', box2X + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Payment ID: ${paymentId}`, box2X + 4, currentY + 12);
  doc.text(`Order / Ref ID: ${orderId}`, box2X + 4, currentY + 17.5);
  doc.text(`Transaction Time: ${buyDateStr} at ${buyTimeStr}`, box2X + 4, currentY + 22.5);
  doc.text(`Payment Method: Razorpay AutoPay / UPI / NetBanking`, box2X + 4, currentY + 27.5);

  currentY += boxH + 6;

  // 6. Validity Period Highlight Banner
  doc.setFillColor(238, 242, 255); // #eef2ff
  doc.setDrawColor(199, 210, 254); // #c7d2fe
  doc.roundedRect(margin, currentY, contentWidth, 11, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202); // #4338ca
  doc.text(
    `SUBSCRIPTION VALIDITY: Valid from ${buyDateStr} to ${expiresDateStr} (${durationDays} Days Full Pro Access)`,
    margin + 4,
    currentY + 7
  );

  currentY += 16;

  // 7. Itemized Table
  // Table Header
  const thH = 8;
  doc.setFillColor(79, 70, 229); // #4f46e5
  doc.roundedRect(margin, currentY, contentWidth, thH, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PLAN / SERVICE DESCRIPTION', margin + 4, currentY + 5.5);
  doc.text('VALIDITY', margin + 98, currentY + 5.5);
  doc.text('ORIGINAL', margin + 130, currentY + 5.5, { align: 'right' });
  doc.text('AMOUNT (INR)', margin + contentWidth - 4, currentY + 5.5, { align: 'right' });

  currentY += thH;

  // Table Row
  const rowH = 18;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, rowH, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(tx.itemName, margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Full Template Access, Custom Bio-Link, QR Code, Resume Builder & Live Hosting', margin + 4, currentY + 11);
  if (tx.couponApplied) {
    doc.setTextColor(21, 128, 61);
    doc.text(`Coupon Applied: ${tx.couponApplied} (Saved INR ${discountAmountNum.toFixed(2)})`, margin + 4, currentY + 15);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`${durationDays} Days`, margin + 98, currentY + 8);

  doc.text(`Rs. ${originalPriceNum.toFixed(2)}`, margin + 130, currentY + 8, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Rs. ${paidPriceNum.toFixed(2)}`, margin + contentWidth - 4, currentY + 8, { align: 'right' });

  currentY += rowH + 6;

  // 8. Totals Breakdown Card (Right aligned)
  const totalsW = 85;
  const totalsX = margin + contentWidth - totalsW;
  let totalsY = currentY;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsX, totalsY + 4);
  doc.setTextColor(30, 41, 59);
  doc.text(`Rs. ${originalPriceNum.toFixed(2)}`, margin + contentWidth - 4, totalsY + 4, { align: 'right' });

  totalsY += 6;

  // Coupon Discount
  if (discountAmountNum > 0 || tx.couponApplied) {
    doc.setTextColor(21, 128, 61);
    doc.text(`Coupon Discount (${tx.couponApplied || 'PROMO'}):`, totalsX, totalsY + 4);
    doc.text(`- Rs. ${discountAmountNum.toFixed(2)}`, margin + contentWidth - 4, totalsY + 4, { align: 'right' });
    totalsY += 6;
  }

  // Tax
  doc.setTextColor(100, 116, 139);
  doc.text('GST / Applicable Tax (0%):', totalsX, totalsY + 4);
  doc.setTextColor(30, 41, 59);
  doc.text('Rs. 0.00', margin + contentWidth - 4, totalsY + 4, { align: 'right' });

  totalsY += 7;

  // Grand Total Banner
  doc.setFillColor(245, 243, 255); // #f5f3ff
  doc.setDrawColor(124, 58, 237);
  doc.roundedRect(totalsX - 4, totalsY, totalsW + 4, 11, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(124, 58, 237);
  doc.text('TOTAL AMOUNT PAID:', totalsX, totalsY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text(`Rs. ${paidPriceNum.toFixed(2)} INR`, margin + contentWidth - 4, totalsY + 7.2, { align: 'right' });

  // Security Seal / Verification Badge on Left side of totals
  const sealX = margin;
  const sealY = currentY;
  const sealW = contentWidth - totalsW - 10;
  
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(sealX, sealY, sealW, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  doc.text('[ VERIFIED PAYMENT RECEIPT ]', sealX + 4, sealY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('This invoice confirms successful receipt of your online payment.', sealX + 4, sealY + 11);
  doc.text('All premium portfolio features have been activated on your account.', sealX + 4, sealY + 15.5);
  doc.text('Powered by Infowaves Media Agency • support@campuscv.com', sealX + 4, sealY + 20);

  currentY = Math.max(totalsY + 16, sealY + 30);

  // 9. Terms & Footer Section (at bottom)
  const footerY = 254;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('CampusCV Technologies  •  Powered by Infowaves Media Agency', pageWidth / 2, footerY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('This is a computer-generated tax invoice and requires no physical signature.', pageWidth / 2, footerY + 9.5, { align: 'center' });
  doc.text('For any billing queries, receipts, or account assistance, please email support@campuscv.com', pageWidth / 2, footerY + 14, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text('https://campuscv.com', pageWidth / 2, footerY + 18.5, { align: 'center' });

  // 10. Bottom Colored Footer Bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');

  // 11. Save PDF file to user browser
  const sanitizedInvoiceName = rawInvoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`CampusCV-Invoice-${sanitizedInvoiceName}.pdf`);
}
