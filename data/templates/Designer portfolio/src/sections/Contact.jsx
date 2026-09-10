import React from 'react';
import { Mail, ArrowUpRight, ExternalLink } from 'lucide-react';

export default function Contact({ data = {} }) {
  const personal = data.personal || {};
  const contact = data.contact || {};
  const profile = data.profile || {};
  const socials = data.socials || data.socialLinks || data.social || {};

  const email = data.email || data.ownerEmail || personal.email || contact.email || profile.email || socials.email || "";

  const eyebrow = data.contactEyebrow || contact.eyebrow || "Let's Collaborate";
  const title = data.contactTitle || contact.title || "Have an interesting product problem? Let's design something worth using.";
  const description = data.contactDescription || contact.description || "Currently open for select freelance visual projects, product design consulting, and full-time product design leadership roles.";

  // Dynamic social links builder without fake fallbacks
  let socialLinks = Array.isArray(data.socialLinks)
    ? data.socialLinks
    : (Array.isArray(data.socialLinks?.items)
      ? data.socialLinks.items
      : (Array.isArray(data.socials) ? data.socials : []));

  if (!socialLinks || socialLinks.length === 0) {
    const inferred = [];
    const gh = socials.github || data.github || personal.github;
    const li = socials.linkedin || data.linkedin || personal.linkedin;
    const dr = socials.dribbble || data.dribbble || personal.dribbble;
    const be = socials.behance || data.behance || personal.behance;
    const ig = socials.instagram || data.instagram || personal.instagram;
    const tw = socials.twitter || socials.x || data.twitter || personal.twitter;
    const web = socials.website || socials.url || data.website || personal.website;

    if (li) inferred.push({ name: "LinkedIn", url: li.startsWith('http') ? li : `https://${li}` });
    if (dr) inferred.push({ name: "Dribbble", url: dr.startsWith('http') ? dr : `https://${dr}` });
    if (gh) inferred.push({ name: "GitHub", url: gh.startsWith('http') ? gh : `https://${gh}` });
    if (be) inferred.push({ name: "Behance", url: be.startsWith('http') ? be : `https://${be}` });
    if (ig) inferred.push({ name: "Instagram", url: ig.startsWith('http') ? ig : `https://${ig}` });
    if (tw) inferred.push({ name: "Twitter", url: tw.startsWith('http') ? tw : `https://${tw}` });
    if (web) inferred.push({ name: "Website", url: web.startsWith('http') ? web : `https://${web}` });

    socialLinks = inferred;
  }

  return (
    <section id="contact" data-cv-section="contact" data-node-id="container:contact:section:0" className="py-16 sm:py-24 md:py-36 border-t border-[#E5E0D8]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 text-center space-y-8 sm:space-y-12">
        
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <span data-node-id="text:contact:eyebrow:0" className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block" data-cv="contact.eyebrow">
            {eyebrow}
          </span>

          <h2 data-node-id="text:contact:title:0" className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.1] break-normal whitespace-normal hyphens-none max-w-full" data-cv="contact.title">
            {title}
          </h2>

          <p data-node-id="text:contact:description:0" className="text-sm sm:text-base md:text-lg text-[#666666] font-normal leading-relaxed break-normal whitespace-normal max-w-2xl mx-auto" data-cv="contact.description">
            {description}
          </p>
        </div>

        {/* Big Email / Get In Touch CTA */}
        <div className="w-full max-w-full flex justify-center px-2">
          {email ? (
            <a
              href={`mailto:${email}`}
              data-node-id="button:contact:email:0"
              data-cv="contact.email"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#111111] text-white text-sm sm:text-base font-bold hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-all shadow-xl max-w-full group"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] group-hover:text-white transition-colors" />
              <span data-node-id="text:contact:email:0" className="break-all sm:break-normal text-center">
                {email}
              </span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <a
              href="#hero"
              data-node-id="button:contact:email:0"
              data-cv="contact.email"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#111111] text-white text-sm sm:text-base font-bold hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-all shadow-xl max-w-full group"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] group-hover:text-white transition-colors" />
              <span data-node-id="text:contact:email:0" className="break-normal">Get In Touch</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>

        {/* Social Links List */}
        {socialLinks.length > 0 && (
          <div className="pt-8 sm:pt-12 border-t border-[#E5E0D8] max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8" data-cv-collection="socialLinks.items">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url || social.href || "#"}
                data-node-id={`button:contact:social:${idx}`}
                data-cv="socialLinks.items[].url"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#111111] hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors px-2 py-1"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] shrink-0" />
                <span data-node-id={`text:contact:social:${idx}`} data-cv="socialLinks.items[].name" className="break-normal">{social.name || social.label || social.platform}</span>
              </a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}


