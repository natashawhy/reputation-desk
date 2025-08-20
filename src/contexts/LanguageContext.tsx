'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, LANGUAGES } from '@/lib/languages';

interface LanguageContextType {
  interfaceLanguage: Language;
  setInterfaceLanguage: (lang: Language) => void;
  getLanguageInfo: (lang: Language) => typeof LANGUAGES.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [interfaceLanguage, setInterfaceLanguage] = useState<Language>('en');

  const getLanguageInfo = (lang: Language) => LANGUAGES[lang];

  return (
    <LanguageContext.Provider value={{
      interfaceLanguage,
      setInterfaceLanguage,
      getLanguageInfo
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
