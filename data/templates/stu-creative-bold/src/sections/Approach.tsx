"use client";

import React from "react";
import { Search, Palette, Cpu, Rocket } from "lucide-react";
import { approachSteps as fallbackApproachSteps, ApproachStep } from "@/data/portfolio";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Search":
      return <Search className="w-4 h-4 text-[#111111]" />;
    case "Palette":
      return <Palette className="w-4 h-4 text-[#111111]" />;
    case "Cpu":
      return <Cpu className="w-4 h-4 text-[#111111]" />;
    case "Rocket":
      return <Rocket className="w-4 h-4 text-[#111111]" />;
    default:
      return <Search className="w-4 h-4 text-[#111111]" />;
  }
};

interface ApproachProps {
  data?: any;
  approachSteps?: ApproachStep[];
}

export default function Approach(props: ApproachProps = {}) {
  const steps: ApproachStep[] = Array.isArray(props.approachSteps) && props.approachSteps.length > 0
    ? props.approachSteps
    : (Array.isArray(props.data?.approachSteps) && props.data.approachSteps.length > 0
      ? props.data.approachSteps
      : (Array.isArray(props.data?.workflow) && props.data.workflow.length > 0
        ? props.data.workflow
        : fallbackApproachSteps));

  return (
    <section
      id="approach"
      data-section="approach"
      data-node-id="section:approach:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Vertical Timeline Steps */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col mb-12 space-y-3">
              <span
                data-field="approach.subtitle"
                className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
              >
                Workflow
              </span>
              <h2
                data-field="approach.title"
                data-node-id="text:approach:root:h2:0"
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
              >
                MY APPROACH
              </h2>
              <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
            </div>

            {/* Timeline */}
            <div className="relative pl-8 sm:pl-10 space-y-12">
              {/* Vertical Connector Line */}
              <div className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-0.5 bg-[#111111]/10" />

              {steps.map((step: any, i: number) => {
                const stepNum = step.step || step.stepNumber || `0${i + 1}`;
                return (
                  <div
                    key={stepNum || i}
                    data-node-id={`container:approach:step:${i}`}
                    className="relative flex items-start group"
                  >
                    {/* Step Bullet Badge */}
                    <div className="absolute -left-8 sm:-left-10 top-0.5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-[#FAF9F6] border-4 border-[#FAF9F6] group-hover:bg-[#FFC107] group-hover:text-[#111111] transition-colors duration-150 shadow-sm z-10">
                      <span className="text-xs font-black">{stepNum}</span>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 bg-white border border-[#111111]/10 rounded-md group-hover:border-[#FFC107]/60 transition-colors duration-150 shadow-sm flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="p-1.5 rounded-full"
                          style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
                        >
                          {getIcon(step.icon)}
                        </div>
                        <h3
                          data-field={`approachSteps[${i}].title`}
                          data-node-id={`text:approach:step:${i}:title`}
                          className="text-base sm:text-lg font-black tracking-tight text-[#111111]"
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        data-field={`approachSteps[${i}].description`}
                        data-node-id={`text:approach:step:${i}:desc`}
                        className="text-xs sm:text-sm text-[#666666] leading-relaxed"
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Creative Visual Feature Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-8 bg-[#111111] text-white rounded-md border-2 border-[#111111] shadow-2xl max-w-sm w-full overflow-hidden" style={{ backgroundColor: "#111111", color: "#ffffff" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/15 rounded-full blur-3xl pointer-events-none" />
              
              <span className="text-[10px] font-black text-[#FFC107] tracking-widest uppercase">
                Core Principles
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white mt-1 mb-6">
                CLEAN. FAST. ACCESSIBLE.
              </h3>

              <div className="space-y-4 text-xs text-[#FAF9F6]/80 leading-relaxed font-medium">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107] mt-1.5 shrink-0" />
                  <p><strong className="text-white">User-Centric Architecture:</strong> Focused on delivering seamless, accessible interfaces across every device.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107] mt-1.5 shrink-0" />
                  <p><strong className="text-white">Scalable Code:</strong> Modular, robust frontend code engineered for lightning-fast edge performance.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107] mt-1.5 shrink-0" />
                  <p><strong className="text-white">Outcome Oriented:</strong> Iterating quickly to deliver real value and polished visual craftsmanship.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
