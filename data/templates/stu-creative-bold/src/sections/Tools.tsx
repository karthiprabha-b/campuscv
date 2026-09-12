"use client";

import React from "react";
import { toolsIUse as fallbackTools, ToolItem } from "@/data/portfolio";

// Logo SVG Mapper
const ToolLogo = ({ iconName }: { iconName: string }) => {
  switch (iconName?.toLowerCase()) {
    case "figma":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2c-2.2 0-4 1.8-4 4s1.8 4 4 4c0-2.2 1.8-4 4-4s4-1.8 4-4-1.8-4-4-4zm0 8c-2.2 0-4 1.8-4 4s1.8 4 4 4h4v-8zm8-2c0-2.2-1.8-4-4-4v8c2.2 0 4-1.8 4-4zm-8 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4v-4zm8-6c0 2.2-1.8 4-4 4v-8c2.2 0 4 1.8 4 4z" fill="#F24E1E" />
        </svg>
      );
    case "photoshop":
      return (
        <div className="w-8 h-8 rounded-sm bg-[#001833] flex items-center justify-center font-bold text-xs text-[#31A8FF] border border-[#31A8FF]/20 select-none">
          Ps
        </div>
      );
    case "adobe-xd":
      return (
        <div className="w-8 h-8 rounded-sm bg-[#2C001E] flex items-center justify-center font-bold text-xs text-[#FF2BC2] border border-[#FF2BC2]/20 select-none">
          Xd
        </div>
      );
    case "illustrator":
      return (
        <div className="w-8 h-8 rounded-sm bg-[#261300] flex items-center justify-center font-bold text-xs text-[#FF9A00] border border-[#FF9A00]/20 select-none">
          Ai
        </div>
      );
    case "vscode":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.984 6.309a.747.747 0 0 0-.291-.497L19.26.852a.748.748 0 0 0-.986.079l-8.91 8.91-4.996-3.805a.746.746 0 0 0-.82-.047L.416 8.01a.748.748 0 0 0-.295.837l2.87 9.873a.748.748 0 0 0 .285.44l4.582 3.97a.748.748 0 0 0 .973-.064l8.948-8.947 5.018 3.804c.264.2.628.21.902.025l3.14-2.124a.748.748 0 0 0 .299-.834l-3.054-9.689zM18 12.016L8.687 2.703 18 12.016z" fill="#007ACC" />
        </svg>
      );
    case "github":
      return (
        <svg className="w-8 h-8 fill-current text-[#111111]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      );
    case "notion":
      return (
        <svg className="w-8 h-8 fill-current text-[#111111]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.2 3h15.6c.7 0 1.2.5 1.2 1.2v15.6c0 .7-.5 1.2-1.2 1.2H4.2c-.7 0-1.2-.5-1.2-1.2V4.2C3 3.5 3.5 3 4.2 3zm3.7 3.5H6.2v10.9h1.7V10.1l5.5 7.3h1.7V6.5h-1.7v7.3L7.9 6.5z" />
        </svg>
      );
    case "postman":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5 12a10.5 10.5 0 11-21 0 10.5 10.5 0 0121 0z" fill="#FF6C37" />
          <path d="M12 4.5v15c2.3 0 4.1-1.8 4.1-4.1V8.6c0-2.3-1.8-4.1-4.1-4.1z" fill="#FFF" />
          <path d="M10.1 7.1c0-.8.7-1.5 1.5-1.5V11c-.8 0-1.5-.7-1.5-1.5V7.1z" fill="#FFF" />
        </svg>
      );
    default:
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#111111]"
          style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
        >
          {iconName?.substring(0, 2).toUpperCase() || 'T'}
        </div>
      );
  }
};

interface ToolsProps {
  data?: any;
  tools?: ToolItem[];
}

export default function Tools(props: ToolsProps = {}) {
  const toolsList: ToolItem[] = Array.isArray(props.tools) && props.tools.length > 0
    ? props.tools
    : (Array.isArray(props.data?.tools) && props.data.tools.length > 0
      ? props.data.tools
      : fallbackTools);

  return (
    <section
      id="tools"
      data-section="tools"
      data-node-id="section:tools:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 items-center text-center space-y-3">
          <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
            Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
            TOOLS &amp; SOFTWARE
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {toolsList.map((tool: ToolItem, idx: number) => (
            <div
              key={tool.name || idx}
              data-node-id={`container:tools:card:${idx}`}
              className="p-6 bg-white border-2 border-[#111111]/10 rounded-md flex flex-col items-center justify-center text-center space-y-3 shadow-xs hover:border-[#FFC107] transition-colors duration-150 group cursor-pointer"
            >
              {/* Tool Icon */}
              <div className="p-3 bg-[#111111]/[0.03] group-hover:bg-[#FFC107]/20 rounded-xl transition-colors duration-150">
                <ToolLogo iconName={tool.iconName || (tool as any).icon} />
              </div>

              {/* Tool Label */}
              <div>
                <h3 className="text-xs sm:text-sm font-black tracking-tight text-[#111111] group-hover:text-[#111111] transition-colors">
                  {tool.name}
                </h3>
                <span className="text-[10px] font-bold text-[#666666]">
                  {(tool as any).level || "Proficient"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
