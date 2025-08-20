import { ReactNode } from "react";
import { Folder, Scale, FileWarning, Globe } from "lucide-react";

export function DeskChrome({ children }: { children: ReactNode }) {
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
            <h1 className="text-xl font-semibold tracking-wide">
              Reputation Desk
            </h1>
            <span className="text-stone-400">Brand & Personality Controversy Tracker</span>
          </div>
        </header>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 space-y-3">
            <Panel title="Dossiers" icon={<FileWarning className="h-4 w-4" />}>
              <ul className="space-y-2 text-sm text-stone-300">
                <li>Advertising & Campaigns</li>
                <li>Finance & Donations</li>
                <li>Labor & Supply Chain</li>
                <li>Privacy & Security</li>
                <li>Social & Speech</li>
              </ul>
            </Panel>
            
            <Panel title="Press by Language" icon={<Globe className="h-4 w-4" />}>
              <div className="space-y-3">
                <LanguageButton 
                  language="Spanish" 
                  flag="🇪🇸" 
                  description="Spanish language press coverage"
                />
                <LanguageButton 
                  language="Russian" 
                  flag="🇷🇺" 
                  description="Russian language press coverage"
                />
                <LanguageButton 
                  language="French" 
                  flag="🇫🇷" 
                  description="French language press coverage"
                />
              </div>
            </Panel>
            
            <Panel title="Investigation Tools" icon={<Scale className="h-4 w-4" />}>
              <div className="space-y-2 text-sm text-stone-300">
                <div className="p-2 rounded bg-stone-700/50">
                  <p className="font-medium text-amber-300">Multi-Source Verification</p>
                  <p className="text-xs text-stone-400">Cross-reference at least two sources per event for credibility.</p>
                </div>
                <div className="p-2 rounded bg-stone-700/50">
                  <p className="font-medium text-amber-300">Perspective Analysis</p>
                  <p className="text-xs text-stone-400">Adjust scoring based on ideological alignment.</p>
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
