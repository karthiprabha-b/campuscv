"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { doctorData as defaultDoctorData } from "../data/doctorData";
import { DoctorProfile } from "../types/doctor";

interface CampusCVContextType {
  data: DoctorProfile;
  updateField: (path: string, value: any) => void;
  isEditorMode: boolean;
}

const CampusCVContext = createContext<CampusCVContextType>({
  data: defaultDoctorData,
  updateField: () => {},
  isEditorMode: false,
});

export const useCampusCV = () => useContext(CampusCVContext);

export function CampusCVProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DoctorProfile>(defaultDoctorData);
  const [isEditorMode, setIsEditorMode] = useState(false);

  useEffect(() => {
    // Check if running inside CampusCV iframe or editor
    if (typeof window !== "undefined") {
      const inIframe = window.self !== window.top;
      if (inIframe) {
        setIsEditorMode(true);
      }

      // Check for global window.CAMPUSCV_DATA override
      if ((window as any).CAMPUSCV_DATA) {
        setData((prev) => ({ ...prev, ...(window as any).CAMPUSCV_DATA }));
      }

      // Listen for live messages from parent CampusCV editor
      const handleMessage = (event: MessageEvent) => {
        if (!event.data) return;

        // Full dataset sync
        if (event.data.type === "CAMPUSCV_UPDATE_DATA" && event.data.payload) {
          setData((prev) => ({ ...prev, ...event.data.payload }));
        }

        // Single field edit sync
        if (event.data.type === "CAMPUSCV_UPDATE_FIELD" && event.data.path) {
          const { path, value } = event.data;
          setData((prev) => {
            const next = { ...prev };
            const keys = path.split(".");
            let current: any = next;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!current[keys[i]]) current[keys[i]] = {};
              current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return { ...next };
          });
        }
      };

      window.addEventListener("message", handleMessage);
      // Notify parent CampusCV editor that template is mounted and ready
      window.parent.postMessage({ type: "CAMPUSCV_TEMPLATE_READY", templateId: "doctor-portfolio" }, "*");

      return () => window.removeEventListener("message", handleMessage);
    }
  }, []);

  const updateField = (path: string, value: any) => {
    setData((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...next };
    });
  };

  return (
    <CampusCVContext.Provider value={{ data, updateField, isEditorMode }}>
      {children}
    </CampusCVContext.Provider>
  );
}
