"use client";

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, CheckCircle2, ExternalLink, Share2 } from 'lucide-react';
import { getPortfolioUrl, normalizeUsername } from '../../utils/urlHelper';
import CampusCvLogo from './CampusCvLogo';

interface CampusCvQrCodeProps {
  username?: string;
  customDomain?: string;
  url?: string;
  size?: number;
  className?: string;
  showActions?: boolean;
  showUrlText?: boolean;
}

export default function CampusCvQrCode({
  username = '',
  customDomain = '',
  url = '',
  size = 140,
  className = '',
  showActions = true,
  showUrlText = true,
}: CampusCvQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  const cleanUser = username ? normalizeUsername(username) : '';
  const cleanDomain = customDomain ? customDomain.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '') : '';
  const targetUrl = url || (cleanDomain ? `https://${cleanDomain}` : (cleanUser ? getPortfolioUrl(cleanUser) : ''));

  const shareText = `Check out my verified portfolio built on CampusCV — A Smarter Way to Build Your Resume.\n\n🔗 View Live: ${targetUrl}`;

  useEffect(() => {
    if (!targetUrl || !canvasRef.current) return;

    let isCancelled = false;
    const renderSize = size * 2; // high-dpi 2x scale
    canvasRef.current.width = renderSize;
    canvasRef.current.height = renderSize;

    QRCode.toCanvas(canvasRef.current, targetUrl, {
      width: renderSize,
      margin: 3, // Clean quiet zone
      errorCorrectionLevel: 'H', // 30% recovery for big center logo
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(() => {
        if (!isCancelled) setQrReady(true);
      })
      .catch((err) => {
        console.error('[CampusCvQrCode Error]', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [targetUrl, size]);

  const handleCopy = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed, fallback', e);
    }
  };

  const generateBrandedQrBlob = async (): Promise<Blob | null> => {
    if (!targetUrl) return null;

    const width = 1000;
    const height = 1120;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const dCtx = canvas.getContext('2d');
    if (!dCtx) return null;

    // 1. Draw outer clean background
    dCtx.fillStyle = '#FAF8F5';
    dCtx.fillRect(0, 0, width, height);

    // 2. Draw inner white card with soft shadow & border
    const cardMargin = 36;
    const cardW = width - cardMargin * 2;
    const cardH = height - cardMargin * 2;
    const cardRadius = 28;

    dCtx.fillStyle = '#ffffff';
    dCtx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    dCtx.shadowBlur = 24;
    dCtx.shadowOffsetY = 8;
    dCtx.beginPath();
    if (typeof (dCtx as any).roundRect === 'function') {
      (dCtx as any).roundRect(cardMargin, cardMargin, cardW, cardH, cardRadius);
    } else {
      dCtx.rect(cardMargin, cardMargin, cardW, cardH);
    }
    dCtx.fill();
    dCtx.shadowColor = 'transparent';

    dCtx.strokeStyle = '#E5E0D8';
    dCtx.lineWidth = 2;
    dCtx.stroke();

    // 3. Top Header: 2-Line About Text
    dCtx.fillStyle = '#7C3AED';
    dCtx.font = '800 18px system-ui, -apple-system, sans-serif';
    dCtx.textAlign = 'center';
    dCtx.fillText('CAMPUSCV • VERIFIED PORTFOLIO', width / 2, 95);

    dCtx.fillStyle = '#0f172a';
    dCtx.font = '800 30px system-ui, -apple-system, sans-serif';
    dCtx.fillText('Check out my verified portfolio', width / 2, 145);

    dCtx.fillStyle = '#475569';
    dCtx.font = '600 22px system-ui, -apple-system, sans-serif';
    dCtx.fillText('built on CampusCV — A Smarter Way to Build Your Resume.', width / 2, 185);

    // 4. Center QR Code (Under the text)
    const qrSize = 520;
    const qrX = (width - qrSize) / 2;
    const qrY = 225;

    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;
    await QRCode.toCanvas(qrCanvas, targetUrl, {
      width: qrSize,
      margin: 3,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    dCtx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // 5. Center Favicon Badge on the QR Code
    const badgeBoxSize = Math.floor(qrSize * 0.24);
    const centerQrX = width / 2;
    const centerQrY = qrY + qrSize / 2;
    const boxTopLeftX = centerQrX - badgeBoxSize / 2;
    const boxTopLeftY = centerQrY - badgeBoxSize / 2;
    const cornerRadius = 18;

    dCtx.fillStyle = '#ffffff';
    dCtx.beginPath();
    if (typeof (dCtx as any).roundRect === 'function') {
      (dCtx as any).roundRect(boxTopLeftX, boxTopLeftY, badgeBoxSize, badgeBoxSize, cornerRadius);
    } else {
      dCtx.rect(boxTopLeftX, boxTopLeftY, badgeBoxSize, badgeBoxSize);
    }
    dCtx.fill();
    dCtx.strokeStyle = '#E2E8F0';
    dCtx.lineWidth = 3;
    dCtx.stroke();

    await new Promise<void>((resolve) => {
      const drawLogoWithAspect = (img: HTMLImageElement) => {
        const innerPadding = Math.floor(badgeBoxSize * 0.16);
        const availSize = badgeBoxSize - innerPadding * 2;
        const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
        let drawW = availSize;
        let drawH = availSize;
        if (aspect > 1) {
          drawH = availSize / aspect;
        } else {
          drawW = availSize * aspect;
        }
        const drawX = centerQrX - drawW / 2;
        const drawY = centerQrY - drawH / 2;
        dCtx.drawImage(img, drawX, drawY, drawW, drawH);
        resolve();
      };

      const logoImg = new Image();
      logoImg.onload = () => drawLogoWithAspect(logoImg);
      logoImg.onerror = () => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => drawLogoWithAspect(fallbackImg);
        fallbackImg.onerror = () => resolve();
        fallbackImg.src = '/assets/campus_cv_icon.png';
      };
      logoImg.src = '/assets/Campus%20CV%20Logo.png';
    });

    // 6. Live Link (Under the QR Code)
    const linkBoxW = 720;
    const linkBoxH = 64;
    const linkBoxX = (width - linkBoxW) / 2;
    const linkBoxY = 785;

    dCtx.fillStyle = '#F8FAFC';
    dCtx.beginPath();
    if (typeof (dCtx as any).roundRect === 'function') {
      (dCtx as any).roundRect(linkBoxX, linkBoxY, linkBoxW, linkBoxH, 18);
    } else {
      dCtx.rect(linkBoxX, linkBoxY, linkBoxW, linkBoxH);
    }
    dCtx.fill();
    dCtx.strokeStyle = '#CBD5E1';
    dCtx.lineWidth = 1.5;
    dCtx.stroke();

    dCtx.fillStyle = '#7C3AED';
    dCtx.font = '700 25px system-ui, -apple-system, monospace, sans-serif';
    dCtx.fillText(`🔗 View Live: ${targetUrl}`, width / 2, 826);

    // Footer branding line
    dCtx.fillStyle = '#64748B';
    dCtx.font = '500 18px system-ui, -apple-system, sans-serif';
    dCtx.fillText('Created with CampusCV — A Smarter Way to Build Your Resume.', width / 2, 905);

    return new Promise<Blob | null>((res) => {
      canvas.toBlob(res, 'image/png');
    });
  };

  const handleShare = async () => {
    if (!targetUrl) return;

    // 1. Try sharing the branded QR card image file + message via Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const blob = await generateBrandedQrBlob();
        if (blob) {
          const file = new File([blob], `campuscv-qr-${cleanUser || 'portfolio'}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${cleanUser}'s Portfolio | CampusCV`,
              text: shareText,
              files: [file],
            });
            setShared(true);
            setTimeout(() => setShared(false), 2500);
            return;
          }
        }
        await navigator.share({
          title: `${cleanUser}'s Portfolio | CampusCV`,
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // 2. Fallback: Copy 2-line about message + live link to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (e) {
      console.warn('Clipboard share failed', e);
    }
  };

  const handleDownload = async () => {
    if (!targetUrl) return;
    const blob = await generateBrandedQrBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `campuscv-qr-${cleanUser || 'portfolio'}.png`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!cleanUser) {
    return (
      <div className="w-44 h-44 bg-zinc-100 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center p-4 text-center">
        <span className="text-xs text-zinc-400 font-medium">Publish your portfolio to generate your public link and QR code.</span>
      </div>
    );
  }

  const badgeSize = Math.floor(size * 0.28);

  return (
    <div className={`flex flex-col items-center gap-3 w-full ${className}`}>
      {/* Compact QR Code Container — Perfect Fit */}
      <div
        className="bg-white p-2.5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-center relative shrink-0"
        style={{ width: `${size + 20}px`, height: `${size + 20}px` }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: `${size}px`, height: `${size}px`, maxWidth: `${size}px`, maxHeight: `${size}px`, display: 'block' }}
          className="block shrink-0"
        />

        {/* Prominent Center Favicon Badge Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="bg-white p-1 rounded-xl shadow-md border border-zinc-200 flex items-center justify-center overflow-hidden"
            style={{ width: `${badgeSize}px`, height: `${badgeSize}px` }}
          >
            <CampusCvLogo
              variant="icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {showUrlText && (
        <div className="text-center w-full px-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-violet-600 hover:underline flex items-center gap-1 font-semibold break-all justify-center"
          >
            <span className="truncate max-w-[280px]">{targetUrl}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      )}

      {showActions && (
        <div className="w-full grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Copy portfolio link"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="h-9 px-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
            title="Share portfolio QR & link"
          >
            {shared ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">Shared!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-violet-200 shrink-0" />
                <span className="truncate">Share QR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-9 px-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
            title="Download QR code image"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">Download</span>
          </button>
        </div>
      )}
    </div>
  );
}
