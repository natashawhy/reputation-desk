import { ReactNode } from "react";
import { Folder, Scale, FileWarning, Newspaper } from "lucide-react";

export function DeskChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="pointer-events-none select-none absolute inset-0 opacity-10"
             style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%23222222\\'/><path d=\\'M0 39h40M0 0h40M39 0v40M0 0v40\\' stroke=\\'%23444444\\' stroke-width=\\'1\\'/></svg>')" }} />
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
            <Panel title="Tools" icon={<Scale className="h-4 w-4" />}>
              <p className="text-sm text-stone-300">Cross-reference at least two sources per event for credibility.</p>
            </Panel>
            <Panel title="Feeds" icon={<Newspaper className="h-4 w-4" />}>
              <p className="text-sm text-stone-300">Top-5 by adjusted scandal score.</p>
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

function Panel({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/60 shadow-inner">
      <div className="flex items-center gap-2 border-b border-stone-700 px-3 py-2 text-stone-200">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
