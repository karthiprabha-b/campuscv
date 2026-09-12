"use client";

import React from "react";
import { Layers, Code, Sparkles, Target } from "lucide-react";
import { services as fallbackServices, Service } from "@/data/portfolio";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Layers":
      return <Layers className="w-8 h-8 text-[#111111] stroke-[1.5]" />;
    case "Code":
      return <Code className="w-8 h-8 text-[#111111] stroke-[1.5]" />;
    case "Sparkles":
      return <Sparkles className="w-8 h-8 text-[#111111] stroke-[1.5]" />;
    case "Target":
      return <Target className="w-8 h-8 text-[#111111] stroke-[1.5]" />;
    default:
      return <Layers className="w-8 h-8 text-[#111111] stroke-[1.5]" />;
  }
};

interface WhatIDoProps {
  data?: any;
  services?: Service[];
}

export default function WhatIDo(props: WhatIDoProps = {}) {
  const servicesList: Service[] = Array.isArray(props.services) && props.services.length > 0
    ? props.services
    : (Array.isArray(props.data?.services) && props.data.services.length > 0
      ? props.data.services
      : (Array.isArray(props.data?.whatIDo) && props.data.whatIDo.length > 0
        ? props.data.whatIDo
        : fallbackServices));

  return (
    <section
      id="services"
      data-section="services"
      data-node-id="section:services:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
            Services
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]"
            style={{ lineHeight: 1.15, letterSpacing: '0.01em', wordSpacing: '0.05em' }}
          >
            WHAT I DO
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((svc: Service, idx: number) => (
            <div
              key={svc.title || idx}
              data-node-id={`container:services:card:${idx}`}
              className="p-8 bg-white rounded-md flex flex-col items-start text-left border border-[#111111]/10 shadow-xs hover:border-[#FFC107] transition-colors duration-150 relative group overflow-hidden"
            >
              {/* Icon Container */}
              <div
                className="p-4 rounded-full mb-6 group-hover:bg-[#FFC107] transition-colors duration-150"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
              >
                <div>
                  {getIcon(svc.icon)}
                </div>
              </div>

              {/* Text metadata */}
              <h3 className="text-lg font-black tracking-tight text-[#111111] mb-3">
                {svc.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
