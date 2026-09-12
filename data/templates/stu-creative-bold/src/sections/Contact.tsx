"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { contactData as fallbackContactData, ContactData } from "@/data/portfolio";

interface ContactProps {
  data?: any;
  contact?: Partial<ContactData>;
  email?: string;
  phone?: string;
  location?: string;
}

export default function Contact(props: ContactProps = {}) {
  const contact: ContactData = {
    email: props.email || props.contact?.email || props.data?.contact?.email || props.data?.email || fallbackContactData.email,
    phone: props.phone || props.contact?.phone || props.data?.contact?.phone || props.data?.phone || fallbackContactData.phone,
    location: props.location || props.contact?.location || props.data?.contact?.location || props.data?.location || fallbackContactData.location,
    socials: props.contact?.socials || props.data?.contact?.socials || props.data?.socials || fallbackContactData.socials
  };

  return (
    <section
      id="contact"
      data-section="contact"
      data-node-id="section:contact:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-col items-center space-y-3 mb-10">
          <span
            data-field="contact.subtitle"
            className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
          >
            Get in Touch
          </span>
          <h2
            data-field="contact.title"
            data-node-id="text:contact:root:h2:0"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]"
            style={{ lineHeight: 1.15, letterSpacing: '0.01em' }}
          >
            CONTACT DETAILS
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        <p
          data-field="contact.description"
          data-node-id="text:contact:root:p:desc"
          className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mb-10"
        >
          Have an exciting project idea, a job opportunity, or just want to say hi? Reach out directly via mail or phone.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-3xl">
          {/* Email */}
          {contact.email && (
            <div
              data-node-id="container:contact:card:email"
              className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-150 shadow-sm flex-1"
            >
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Email</h4>
                <a
                  href={`mailto:${contact.email}`}
                  data-field="contact.email"
                  data-cv="profile.email"
                  data-node-id="text:contact:root:a:email"
                  className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#FFC107] transition-colors duration-150 break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {/* Phone */}
          {contact.phone && (
            <div
              data-node-id="container:contact:card:phone"
              className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-150 shadow-sm flex-1"
            >
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <Phone className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Phone</h4>
                <a
                  href={`tel:${contact.phone}`}
                  data-field="contact.phone"
                  data-cv="profile.phone"
                  data-node-id="text:contact:root:a:phone"
                  className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#FFC107] transition-colors duration-150"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {/* Location */}
          {contact.location && (
            <div
              data-node-id="container:contact:card:location"
              className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-150 shadow-sm flex-1"
            >
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Location</h4>
                <span
                  data-field="contact.location"
                  data-cv="profile.location"
                  data-node-id="text:contact:root:span:location"
                  className="text-xs sm:text-sm font-bold text-[#111111]"
                >
                  {contact.location}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
