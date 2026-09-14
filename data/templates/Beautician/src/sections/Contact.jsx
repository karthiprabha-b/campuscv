import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Clock, Calendar, Sparkles, ExternalLink, Car } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Contact({ data = {} }) {
  const beautician = data?.contact || _default.contact || {};
  
  const name = 
    data?.contentOverrides?.['text:contact:name']?.value ||
    data?.hero?.name || data?.name || data?.fullName || data?.personal?.name || _default.name || 'Elena Laurent';

  const email = 
    data?.contentOverrides?.['text:contact:email']?.value ||
    data?.contact?.email ||
    data?.email ||
    data?.ownerEmail ||
    data?.personal?.email ||
    data?.profile?.email ||
    beautician?.email || 'concierge@elenalaurentbeauty.com';

  const phone = 
    data?.contentOverrides?.['text:contact:phone']?.value ||
    data?.contact?.phone ||
    data?.phone ||
    data?.telephone ||
    data?.personal?.phone ||
    beautician?.phone || '+1 (310) 892-4410';

  const phoneClean = (data?.contact?.phoneClean || data?.contact?.whatsapp || phone || '').replace(/\D/g, '');
  
  const rawWhatsapp = 
    data?.contact?.whatsapp || 
    data?.socials?.whatsapp || 
    data?.socialLinks?.whatsapp || 
    data?.whatsapp || 
    phoneClean;
    
  const whatsappClean = (rawWhatsapp || '').replace(/\D/g, '') || phoneClean || '8591068707';
  const whatsappText = encodeURIComponent(`Hello ${name}, I would like to inquire about your services.`);
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${whatsappText}`;

  // Resolve Instagram URL and handle
  let rawInstagram = 
    data?.contact?.instagram || 
    data?.socials?.instagram || 
    data?.socialLinks?.instagram || 
    data?.instagram || 
    data?.personal?.instagram || '';

  if (!rawInstagram) {
    const socialArr = Array.isArray(data?.socialLinks) 
      ? data.socialLinks 
      : (Array.isArray(data?.socials) ? data.socials : []);
    const found = socialArr.find(s => 
      s?.name?.toLowerCase().includes('instagram') || 
      s?.network?.toLowerCase().includes('instagram') ||
      s?.icon?.toLowerCase().includes('instagram') ||
      s?.url?.toLowerCase().includes('instagram')
    );
    if (found) {
      rawInstagram = found.url || found.link || found.handle || '';
    }
  }

  let instagramHandle = '@' + (name || 'beauty').toLowerCase().replace(/[^a-z0-9_]/g, '');
  let finalInstagramHref = 'https://instagram.com';

  if (rawInstagram) {
    if (rawInstagram.startsWith('http://') || rawInstagram.startsWith('https://')) {
      finalInstagramHref = rawInstagram;
      try {
        const parts = new URL(rawInstagram).pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          instagramHandle = `@${parts[0]}`;
        }
      } catch (e) {
        instagramHandle = rawInstagram;
      }
    } else {
      const cleanHandle = rawInstagram.replace(/^@/, '').trim();
      instagramHandle = `@${cleanHandle}`;
      finalInstagramHref = `https://instagram.com/${cleanHandle}`;
    }
  }

  const location = 
    data?.contentOverrides?.['text:contact:location']?.value ||
    data?.contact?.location ||
    data?.contact?.address ||
    data?.location ||
    data?.address ||
    data?.personal?.location ||
    beautician?.location || '450 Rosemont Promenade, Beverly Hills, CA 90210';

  const hours = Array.isArray(beautician?.hours) && beautician.hours.length > 0
    ? beautician.hours
    : (_default.contact?.hours || [
        { days: 'Monday - Friday', time: '9:00 AM - 7:00 PM' },
        { days: 'Saturday', time: '8:30 AM - 6:30 PM' },
        { days: 'Sunday', time: 'By Appointment Only' }
      ]);

  return (
    <section 
      id="contact" 
      data-cv-section="contact"
      data-node-id="section:contact:root:section:0"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#F8D7E3]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C59B6D]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-[#FCEEF3] px-4 py-1.5 rounded-full border border-pink-200 inline-block shadow-xs">
            Direct Contact & Studio Visits
          </span>
          <h2 
            data-node-id="text:contact:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            Connect With The Sanctuary
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            For bridal consultations, dermal skin therapy, or studio appointments, reach out directly through our channels below.
          </p>
        </div>

        {/* Main Grid: Direct Channels & Studio Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Consultation & Inquiries */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Direct Studio Inquiries Card */}
            <div className="bg-[#FAF7F5] rounded-3xl p-8 sm:p-10 border border-pink-200 shadow-luxury space-y-6 pointer-events-auto">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCEEF3] text-[#84354D] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#DF7A98]" />
                  <span>Direct Inquiries & Consultations</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                  Connect With {name}
                </h3>

                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  For bridal styling, personalized dermal skin therapy, or studio inquiries, reach out directly. We provide private concierge assistance with zero delays.
                </p>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="button:contact:whatsapp"
                  data-node-type="button"
                  data-cv="contact.whatsapp"
                  className="flex-1 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href={`tel:${phoneClean || phone}`}
                  data-node-id="button:contact:call"
                  data-node-type="button"
                  data-cv="contact.phoneButton"
                  className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-[#DF7A98] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                >
                  <Phone className="w-4 h-4 text-pink-300" />
                  <span>Direct Call</span>
                </a>
              </div>
            </div>

            {/* Direct Contact Phone & Email Cards */}
            <div className="bg-[#FAF7F5] rounded-3xl p-7 border border-pink-200 shadow-sm space-y-4 pointer-events-auto">
              <h4 className="font-serif font-bold text-lg text-zinc-900">
                Direct Contact Channels
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Telephone */}
                <a
                  href={`tel:${phoneClean || phone}`}
                  data-node-id="link:contact:phone_channel"
                  data-node-type="link"
                  data-cv="contact.phoneLink"
                  className="p-4 rounded-2xl bg-white hover:bg-[#FCEEF3] border border-pink-100 hover:border-pink-300 transition-all flex items-center gap-3.5 group cursor-pointer pointer-events-auto"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FCEEF3] flex items-center justify-center text-[#DF7A98] group-hover:bg-[#DF7A98] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Telephone</span>
                    <span 
                      data-node-id="text:contact:phone"
                      data-node-type="text"
                      data-cv="contact.phone"
                      className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors cursor-text"
                    >
                      {phone}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={email ? (email.startsWith('mailto:') ? email : `mailto:${email}`) : 'mailto:concierge@elenalaurentbeauty.com'}
                  data-node-id="link:contact:email_channel"
                  data-node-type="link"
                  data-cv="contact.emailLink"
                  className="p-4 rounded-2xl bg-white hover:bg-[#FCEEF3] border border-pink-100 hover:border-pink-300 transition-all flex items-center gap-3.5 group cursor-pointer pointer-events-auto"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FCEEF3] flex items-center justify-center text-[#DF7A98] group-hover:bg-[#DF7A98] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Email Inquiries</span>
                    <span 
                      data-node-id="text:contact:email"
                      data-node-type="text"
                      data-cv="contact.email"
                      className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors truncate block max-w-[150px] cursor-text"
                    >
                      {email}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Hours & Location Card */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Studio Address Card */}
            <div className="bg-[#FAF7F5] rounded-3xl p-7 sm:p-8 border border-pink-200 shadow-sm space-y-6 pointer-events-auto">
              <div>
                <div className="flex items-center gap-2 text-[#DF7A98] mb-1">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Studio Location</span>
                </div>
                <h4 
                  data-node-id="text:contact:location"
                  data-node-type="text"
                  data-cv="contact.location"
                  className="font-serif font-bold text-xl text-zinc-900 cursor-text"
                >
                  {location}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary Private Parking Available</span>
                </div>
              </div>

              {/* Operating Hours Table */}
              <div className="pt-4 border-t border-pink-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  <Clock className="w-4 h-4 text-[#DF7A98]" />
                  <span>Studio Hours</span>
                </div>
                {hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white border border-pink-100"
                  >
                    <span className="font-medium text-zinc-700">{h.days}</span>
                    <span className="font-bold text-[#84354D]">{h.time}</span>
                  </div>
                ))}
              </div>

              {/* Stylized Location Map Card */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-pink-200 bg-[#FCEEF3] flex flex-col items-center justify-center text-center p-4">
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#DF7A98] text-white flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="font-serif font-bold text-sm text-zinc-900 truncate max-w-xs">{location}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-node-id="button:contact:maps"
                    data-node-type="button"
                    data-cv="contact.mapButton"
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-bold border border-pink-300 shadow-sm hover:bg-[#DF7A98] hover:text-white transition-all cursor-pointer pointer-events-auto"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="bg-[#FAF7F5] rounded-3xl p-6 border border-pink-200 shadow-sm flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Follow On Social</span>
                <span className="text-xs text-zinc-500">Instagram: {instagramHandle}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={finalInstagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="button:contact:instagram"
                  data-node-type="button"
                  data-cv="contact.instagramButton"
                  className="px-4 py-2 rounded-full bg-white text-[#DF7A98] hover:bg-[#DF7A98] hover:text-white font-semibold text-xs border border-pink-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs pointer-events-auto"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
