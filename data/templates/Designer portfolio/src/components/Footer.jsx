import React from 'react';
import { ChevronUp } from 'lucide-react';

export default function Footer(props = {}) {
  const data = props?.data || props?.portfolio || props || {};
  const personal = data.personal || {};

  const profile = data.profile || {};
  const name = profile.name || profile.fullName || data.name || data.fullName || personal.name || personal.fullName || (typeof props.name === 'string' && props.name ? props.name : "Maya Kapoor");
  const role = profile.headline || data.role || data.headline || personal.role || (typeof props.role === 'string' && props.role ? props.role : "Senior Product Designer");
  const location = profile.location || data.location || personal.location || (typeof props.location === 'string' && props.location ? props.location : "Bengaluru, India");

  if (data?.deletedNodes?.['section:footer:root:section:0'] || data?.deletedNodes?.['footer']) {
    return null;
  }

  return (
    <footer data-node-id="section:footer:root:section:0" data-cv-section="footer" className="border-t border-[#E5E0D8] py-8 sm:py-12 bg-[#FAF8F5]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-[#666666] font-semibold text-center sm:text-left">
        <div>
          <p data-cv="footer.copyright" data-node-id="text:footer:root:copyright:0" className="break-words">
            © {new Date().getFullYear()} {name ? `${name}. ` : ""}All rights reserved.
          </p>
          {(role || location) && (
            <p className="text-[11px] text-[#888888] mt-1 break-words">
              {role && <span data-cv="footer.role" data-node-id="text:footer:root:role:0">{role}</span>}
              {role && location && " — "}
              {location && <span data-cv="footer.location" data-node-id="text:footer:root:location:0">{location}</span>}
            </p>
          )}
        </div>

        <a
          href="#hero"
          data-node-id="button:footer:root:backtotop:0"
          className="flex items-center gap-2 text-[#111111] hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shrink-0"
        >
          <span data-node-id="text:footer:root:backtotop:0">Back to top</span>
          <ChevronUp className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
}

