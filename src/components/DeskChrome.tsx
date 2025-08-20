import { ReactNode } from "react";
import { Scale, FileWarning, Newspaper, Search, FileText, Clock, AlertTriangle } from "lucide-react";

export function DeskChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
      {/* Desk texture overlay */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-20"
           style={{ 
             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23d4a574"/><path d="M0 0h60v60H0z" fill="%23a0522d" opacity="0.1"/><path d="M0 0h60v60H0z" fill="%23cd853f" opacity="0.05"/></svg>')` 
           }} />
      
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        {/* Desk surface with wood grain effect */}
        <div className="relative bg-gradient-to-br from-amber-200 via-amber-100 to-stone-200 rounded-2xl shadow-2xl border-4 border-amber-300 overflow-hidden">
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-30"
               style={{ 
                 backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="wood" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="%23d4a574"/><path d="M0 0h100v100H0z" fill="%23a0522d" opacity="0.1"/><path d="M0 0h100v100H0z" fill="%23cd853f" opacity="0.05"/><path d="M0 0h100v100H0z" fill="%238b4513" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23wood)"/></svg>')` 
               }} />
          
          {/* Header with desk lamp effect */}
          <header className="relative z-10 bg-gradient-to-r from-amber-300/80 to-amber-200/80 backdrop-blur-sm border-b-2 border-amber-400">
            <div className="flex items-center gap-4 py-6 px-8">
              {/* Desk lamp icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="text-white h-6 w-6" />
                </div>
                {/* Lamp glow effect */}
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-amber-300/30 rounded-full blur-md"></div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold tracking-wide text-stone-800">
                  The Reputation Desk
                </h1>
                <span className="text-stone-600 font-medium">Investigative Journalism Command Center</span>
              </div>
              
              {/* Desk accessories */}
              <div className="ml-auto flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <AlertTriangle className="text-white h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <FileText className="text-white h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <Clock className="text-white h-4 w-4" />
                </div>
              </div>
            </div>
          </header>
          
          <div className="grid grid-cols-12 gap-6 p-8">
            {/* Left sidebar - Investigation tools */}
            <aside className="col-span-12 lg:col-span-3 space-y-4">
              {/* Investigation Dossiers */}
              <Panel title="Investigation Dossiers" icon={<FileWarning className="h-5 w-5" />} className="bg-red-50 border-red-200">
                <ul className="space-y-2 text-sm text-stone-700">
                  <li className="flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Advertising & Campaigns
                  </li>
                  <li className="flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Finance & Donations
                  </li>
                  <li className="flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Labor & Supply Chain
                  </li>
                  <li className="flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Privacy & Security
                  </li>
                  <li className="flex items-center gap-2 p-2 rounded bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Social & Speech
                  </li>
                </ul>
              </Panel>
              
              {/* Investigation Tools */}
              <Panel title="Investigation Tools" icon={<Scale className="h-5 w-5" />} className="bg-blue-50 border-blue-200">
                <div className="space-y-3 text-sm text-stone-700">
                  <div className="p-2 rounded bg-blue-100">
                    <p className="font-medium text-blue-800">Source Verification</p>
                    <p className="text-xs text-blue-600">Cross-reference at least two sources per event for credibility.</p>
                  </div>
                  <div className="p-2 rounded bg-blue-100">
                    <p className="font-medium text-blue-800">Perspective Analysis</p>
                    <p className="text-xs text-blue-600">Adjust scoring based on ideological alignment.</p>
                  </div>
                </div>
              </Panel>
              
              {/* Live Feeds */}
              <Panel title="Live Investigation Feeds" icon={<Newspaper className="h-5 w-5" />} className="bg-green-50 border-green-200">
                <div className="space-y-2 text-sm text-stone-700">
                  <div className="p-2 rounded bg-green-100">
                    <p className="font-medium text-green-800">Breaking News</p>
                    <p className="text-xs text-green-600">Top-5 by adjusted scandal score.</p>
                  </div>
                  <div className="p-2 rounded bg-green-100">
                    <p className="font-medium text-green-800">Trending</p>
                    <p className="text-xs text-green-600">Real-time controversy tracking.</p>
                  </div>
                </div>
              </Panel>
            </aside>
            
            {/* Main investigation area */}
            <main className="col-span-12 lg:col-span-9">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-amber-300 shadow-lg p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon, children, className = "" }: { 
  title: string; 
  icon?: ReactNode; 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border-2 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <div className="flex items-center gap-3 border-b-2 px-4 py-3 text-stone-800 font-semibold">
        {icon}
        <span className="text-sm font-bold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
