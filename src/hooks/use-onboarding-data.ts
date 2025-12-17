import { useState, useEffect, useCallback } from "react";

export interface OnboardingData {
  phone: string;
  phoneVerified: boolean;
  firstName: string;
  lastName: string;
  idNumber: string;
  businessName: string;
  businessType: string;
  selectedMethods: string[];
  email: string;
  currentStep: string;
}

const STORAGE_KEY = "patela_onboarding_data";

const defaultData: OnboardingData = {
  phone: "",
  phoneVerified: false,
  firstName: "",
  lastName: "",
  idNumber: "",
  businessName: "",
  businessType: "",
  selectedMethods: ["sms"],
  email: "",
  currentStep: "language",
};

export function useOnboardingData() {
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultData, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load onboarding data:", e);
    }
    return defaultData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save onboarding data:", e);
    }
  }, [data]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
  }, []);

  return { data, updateData, clearData };
}
