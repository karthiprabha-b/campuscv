import React, { useState } from 'react';
import { Scale, Shield, FileText, CheckCircle2, ArrowRight, X } from 'lucide-react';

const ICON_MAP = {
  Scale,
  Shield,
  FileText,
  CheckCircle2,
};

export default function Services(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.services || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawServices = Array.isArray(incoming) ? incoming : (Array.isArray(data?.services) ? data.services : null);
  const services = rawServices && rawServices.length > 0 ? rawServices : [
    { id: "s1", title: "Corporate Governance & M&A", description: "Structured advisory for multi-million dollar acquisitions, venture financing rounds, and shareholder structuring.", detailedPoints: ["Due diligence audits", "Share purchase agreements", "Regulatory filings", "Joint venture framing"], iconName: "Scale" },
    { id: "s2", title: "Commercial Litigation Defense", description: "High-stakes representation in arbitration, contract breach disputes, and federal appellate courts.", detailedPoints: ["Pre-trial negotiation", "Arbitration & mediation", "Contract enforcement", "Asset protection"], iconName: "Shield" },
    { id: "s3", title: "Tech & IP Regulation", description: "Safeguarding trade secrets, global trademark portfolios, data privacy (GDPR/CCPA), and AI compliance.", detailedPoints: ["Patent & trademark strategy", "Data privacy frameworks", "SaaS agreements", "Licensing terms"], iconName: "FileText" },
    { id: "s4", title: "Crisis Management & Compliance", description: "Rapid-response legal defense for regulatory inquiries, anti-trust investigations, and executive risk.", detailedPoints: ["Internal investigations", "Whistleblower defense", "Media legal strategy", "Compliance training"], iconName: "CheckCircle2" },
  ];

  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" className="py-24 bg-white border-y border-[#C89B3C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
              CORE EXPERTISE
            </span>
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Services & Advisory Practice
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] my-4 rounded-full" />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Bespoke legal counsel, high-stakes dispute resolution, and executive strategic advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((serv, index) => {
            const Icon = ICON_MAP[serv?.iconName] || Scale;
            return (
              <div
                key={serv?.id || index}
                className="group bg-[#FAF8F4] p-8 border border-[#C89B3C]/30 hover:border-[#C89B3C] shadow-sm hover:shadow-gold-glow flex flex-col justify-between transition-all duration-300 hover:-translate-y-2"
              >
                <div>
                  <div className="w-14 h-14 bg-white border border-[#C89B3C]/40 flex items-center justify-center text-[#A67D28] mb-6 group-hover:bg-[#C89B3C] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#A67D28] transition-colors">
                    {serv?.title}
                  </h3>

                  <p className="text-sm text-[#6B7280] font-sans font-light leading-relaxed mb-6 line-clamp-3">
                    {serv?.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setSelectedService(serv)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A67D28] hover:text-[#C89B3C] transition-colors font-sans"
                  >
                    <span>Explore Capabilities</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white border border-[#C89B3C]/40 shadow-2xl overflow-hidden z-10 my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#C89B3C]/20 bg-[#FAF8F4]">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                  {selectedService?.title}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-gray-400 hover:text-[#C89B3C] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 font-sans space-y-6">
                <p className="text-base text-[#6B7280] leading-relaxed font-sans">
                  {selectedService?.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67D28] mb-4">
                    Key Scope & Deliverables:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(selectedService?.detailedPoints || []).map((pt, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#FAF8F4] border border-[#C89B3C]/20">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span className="text-xs font-semibold text-[#1A1A1A]">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#C89B3C]/20 flex justify-end">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] text-xs font-bold uppercase tracking-wider"
                  >
                    Close Detail View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
