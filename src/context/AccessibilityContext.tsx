import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'normal' | 'large' | 'xlarge';
type Language = 'en' | 'hi';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  language: Language;
  toggleLanguage: () => void;
  screenReaderAnnouncement: string;
  announce: (message: string) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    portalTitle: 'APAAR Student Data & Verification Platform',
    portalSubtitle: 'For AICTE-Approved Institutions',
    nationalPortal: 'Government of India | AICTE Autonomous Regulatory Body',
    skipToMain: 'Skip to main content',
    highContrast: 'High Contrast',
    screenReader: 'Screen Reader',
    login: 'Sign In / Register',
    logout: 'Sign Out',
    home: 'Home',
    institutions: 'Institutions',
    verification: 'Verify a Passport',
    guidelines: 'GIGW Guidelines',
    demoNotice: 'PROTOTYPE — All data is synthetic. APAAR, AICTE and institutional checks shown here are SIMULATIONS and are not official government verification.',
    simulatedBadge: 'Simulated Check',
    heroBadge: 'Smart India Hackathon 2026 • AICTE PS 26263',
    heroTitle: 'Unified APAAR Student Data Management & Verification Portal',
    heroDesc: 'Empowering 10,000+ AICTE institutions with automated APAAR validation, dynamic seat-compliance ledgers, anomaly reconciliation, and student-controlled Verified Academic Passports.',
    btnDashboard: 'Access Dashboard',
    btnVerifyNow: 'Verify an Academic Passport',
    statInstitutions: 'Approved Institutions',
    statStudents: 'Enrolled Students (Simulated)',
    statVerificationRate: 'Compliance & Verification Rate',
    statAnomaliesDetected: 'Active Anomalies Flagged',
  },
  hi: {
    portalTitle: 'अपार (APAAR) छात्र डेटा एवं सत्यापन मंच',
    portalSubtitle: 'एआईसीटीई (AICTE) अनुमोदित संस्थानों हेतु',
    nationalPortal: 'भारत सरकार | अखिल भारतीय तकनीकी शिक्षा परिषद',
    skipToMain: 'मुख्य सामग्री पर जाएं',
    highContrast: 'उच्च कंट्रास्ट',
    screenReader: 'स्क्रीन रीडर',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    home: 'मुख्य पृष्ठ',
    institutions: 'संस्थान सूची',
    verification: 'पासपोर्ट सत्यापित करें',
    guidelines: 'जीआईजीडब्ल्यू दिशानिर्देश',
    demoNotice: 'प्रोटोटाइप — समस्त डेटा काल्पनिक है। यहां प्रदर्शित अपार, एआईसीटीई तथा संस्थागत सत्यापन केवल सिमुलेशन हैं।',
    simulatedBadge: 'सिम्युलेटेड सत्यापन',
    heroBadge: 'स्मार्ट इंडिया हैकथॉन 2026 • एआईसीटीई समस्या कथन 26263',
    heroTitle: 'एकीकृत अपार (APAAR) छात्र डेटा प्रबंधन एवं सत्यापन मंच',
    heroDesc: 'स्वचालित अपार सत्यापन, गतिशील सीट-अनुपालन लेज़र, विसंगति समाधान और छात्र-नियंत्रित सत्यापित शैक्षणिक पासपोर्ट के साथ संस्थानों का सशक्तिकरण।',
    btnDashboard: 'डैशबोर्ड खोलें',
    btnVerifyNow: 'शैक्षणिक पासपोर्ट सत्यापित करें',
    statInstitutions: 'अनुमोदित संस्थान',
    statStudents: 'नामांकित छात्र (काल्पनिक)',
    statVerificationRate: 'अनुपालन एवं सत्यापन दर',
    statAnomaliesDetected: 'पहचानी गई विसंगतियां',
  },
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('apaar_text_size') as TextSize) || 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('apaar_high_contrast') === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('apaar_language') as Language) || 'en';
  });

  const [screenReaderAnnouncement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('apaar_text_size', textSize);
    const root = document.documentElement;
    if (textSize === 'large') {
      root.style.fontSize = '18px';
    } else if (textSize === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('apaar_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('apaar_language', language);
  }, [language]);

  const increaseTextSize = () => {
    if (textSize === 'normal') setTextSizeState('large');
    else if (textSize === 'large') setTextSizeState('xlarge');
    announce('Text size increased');
  };

  const decreaseTextSize = () => {
    if (textSize === 'xlarge') setTextSizeState('large');
    else if (textSize === 'large') setTextSizeState('normal');
    announce('Text size decreased');
  };

  const resetTextSize = () => {
    setTextSizeState('normal');
    announce('Text size reset to default');
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => {
      const next = !prev;
      announce(next ? 'High contrast enabled' : 'High contrast disabled');
      return next;
    });
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      announce(next === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language changed to English');
      return next;
    });
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize: setTextSizeState,
        increaseTextSize,
        decreaseTextSize,
        resetTextSize,
        highContrast,
        toggleHighContrast,
        language,
        toggleLanguage,
        screenReaderAnnouncement,
        announce,
        t,
      }}
    >
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        aria-atomic="true"
      >
        {screenReaderAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
