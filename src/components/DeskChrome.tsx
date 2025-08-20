'use client';
import { ReactNode } from "react";
import { Folder, Scale, FileWarning, Globe, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/languages";

export function DeskChrome({ children }: { children: ReactNode }) {
  const { interfaceLanguage, setInterfaceLanguage, getLanguageInfo } = useLanguage();
  
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 relative">
      {/* Evidence board background overlay */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-15"
           style={{ 
             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><pattern id="cork" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="%238B4513"/><circle cx="20" cy="20" r="2" fill="%23A0522D" opacity="0.6"/><circle cx="60" cy="40" r="1.5" fill="%23A0522D" opacity="0.4"/><circle cx="100" cy="30" r="1" fill="%23A0522D" opacity="0.5"/><circle cx="30" cy="80" r="1.8" fill="%23A0522D" opacity="0.3"/><circle cx="80" cy="90" r="1.2" fill="%23A0522D" opacity="0.4"/><circle cx="110" cy="70" r="1.5" fill="%23A0522D" opacity="0.3"/><rect x="15" y="15" width="4" height="4" fill="%23A0522D" opacity="0.2" rx="1"/><rect x="85" y="25" width="3" height="3" fill="%23A0522D" opacity="0.3" rx="1"/><rect x="25" y="85" width="5" height="2" fill="%23A0522D" opacity="0.2" rx="1"/><rect x="95" y="85" width="2" height="4" fill="%23A0522D" opacity="0.3" rx="1"/></pattern></defs><rect width="120" height="120" fill="url(%23cork)"/></svg>')` 
           }} />
      
      {/* Subtle grid pattern overlay */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-5"
           style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%23222222\\'/><path d=\\'M0 39h40M0 0h40M39 0v40M0 0v40\\' stroke=\\'%23444444\\' stroke-width=\\'1\\'/></svg>')" }} />
      
      <div className="relative mx-auto max-w-6xl px-4">
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-stone-900/70">
          <div className="flex items-center gap-3 py-4">
            <Folder className="text-amber-400" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-wide">
                {getTranslation(interfaceLanguage, 'title')}
              </h1>
              <span className="text-stone-400">{getTranslation(interfaceLanguage, 'subtitle')}</span>
            </div>
            
            {/* Interface Language Switcher */}
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-stone-400" />
              <div className="flex gap-1">
                {(['en', 'es', 'ru', 'fr'] as const).map((lang) => {
                  const langInfo = getLanguageInfo(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => setInterfaceLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        interfaceLanguage === lang 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                      }`}
                      title={`Switch to ${langInfo.name}`}
                    >
                      {langInfo.flag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 space-y-3">
            <Panel title={getTranslation(interfaceLanguage, 'dossiers')} icon={<FileWarning className="h-4 w-4" />}>
              <ul className="space-y-2 text-sm text-stone-300">
                <li>{getTranslation(interfaceLanguage, 'advertising')}</li>
                <li>{getTranslation(interfaceLanguage, 'finance')}</li>
                <li>{getTranslation(interfaceLanguage, 'labor')}</li>
                <li>{getTranslation(interfaceLanguage, 'privacy')}</li>
                <li>{getTranslation(interfaceLanguage, 'social')}</li>
              </ul>
            </Panel>
            
            <Panel title={getTranslation(interfaceLanguage, 'pressByLanguage')} icon={<Globe className="h-4 w-4" />}>
              <div className="space-y-3">
                <LanguageButton 
                  language="Spanish" 
                  flag="🇪🇸" 
                  description={getTranslation(interfaceLanguage, 'spanishPress')}
                />
                <LanguageButton 
                  language="Russian" 
                  flag="🇷🇺" 
                  description={getTranslation(interfaceLanguage, 'russianPress')}
                />
                <LanguageButton 
                  language="French" 
                  flag="🇫🇷" 
                  description={getTranslation(interfaceLanguage, 'frenchPress')}
                />
              </div>
            </Panel>
            
            <Panel title={getTranslation(interfaceLanguage, 'investigationTools')} icon={<Scale className="h-4 w-4" />}>
              <div className="space-y-2 text-sm text-stone-300">
                <div className="p-2 rounded bg-stone-700/50">
                  <p className="font-medium text-amber-300">{getTranslation(interfaceLanguage, 'multiSourceVerification')}</p>
                  <p className="text-xs text-stone-400">{getTranslation(interfaceLanguage, 'multiSourceDescription')}</p>
                </div>
                <div className="p-2 rounded bg-stone-700/50">
                  <p className="font-medium text-amber-300">{getTranslation(interfaceLanguage, 'perspectiveAnalysis')}</p>
                  <p className="text-xs text-stone-400">{getTranslation(interfaceLanguage, 'perspectiveDescription')}</p>
                </div>
              </div>
            </Panel>
          </aside>
          <main className="col-span-12 md:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function LanguageButton({ language, flag, description }: { 
  language: string; 
  flag: string; 
  description: string;
}) {
  return (
    <button className="w-full p-2 rounded bg-stone-700/50 hover:bg-stone-700/70 transition-colors text-left group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{flag}</span>
        <span className="font-medium text-stone-200">{language}</span>
      </div>
      <p className="text-xs text-stone-400 group-hover:text-stone-300 transition-colors">{description}</p>
    </button>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/60 shadow-inner backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-stone-700 px-3 py-2 text-stone-200">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
