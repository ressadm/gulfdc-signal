import { Link, useLocation } from "wouter";
import {
  Newspaper,
  LayoutDashboard,
  Database,
  TrendingUp,
  Scale,
  Network,
  Lightbulb,
  Radio,
  Activity,
  Sun,
  Moon,
  Menu,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { dataset } from "@/data/dataset";

const NAV = [
  { path: "/", label: "Weekly Brief", icon: Newspaper, testId: "nav-brief" },
  { path: "/dashboard", label: "Market Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { path: "/supply", label: "Supply Tracker", icon: Database, testId: "nav-supply" },
  { path: "/demand", label: "Demand Signals", icon: TrendingUp, testId: "nav-demand" },
  { path: "/regulation", label: "Regulation & Policy", icon: Scale, testId: "nav-regulation" },
  { path: "/partnerships", label: "Partnerships", icon: Network, testId: "nav-partnerships" },
  { path: "/strategy", label: "Strategic Insights", icon: Lightbulb, testId: "nav-strategy" },
  { path: "/weak-signals", label: "Weak Signals", icon: Radio, testId: "nav-weak-signals" },
  { path: "/console", label: "Monitoring Console", icon: Activity, testId: "nav-console" },
  { path: "/archives", label: "Archives", icon: Archive, testId: "nav-archives" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            <Logo />
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50">
              Intelligence
            </div>
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  data-testid={item.testId}
                  className={cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3 text-[11px] text-sidebar-foreground/60">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider">
                {dataset._meta.version} · {dataset._meta.compiled.split(" ")[0]}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded border border-sidebar-border bg-sidebar-accent/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                data-testid="status-dataset"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--signal-live))]" />
                Live
              </span>
            </div>
            <div className="mt-1 leading-tight">
              Priority: KSA → UAE → QAT → OMN → BHR → KWT
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Open navigation"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              GCC Data Center Intelligence
            </span>
            {dataset._meta.public_url && (
              <a
                href={dataset._meta.public_url}
                target="_blank"
                rel="noreferrer noopener"
                className="hidden truncate rounded border border-border px-2 py-1 font-mono text-[10px] text-primary underline-offset-2 hover:underline md:inline"
                data-testid="link-public-url"
              >
                Public: {dataset._meta.public_url}
              </a>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="hidden items-center gap-1.5 rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-flex"
              data-testid="text-data-window"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--signal-watch))]" />
              Window: {dataset._meta.compiled}
            </span>
            <button
              onClick={toggle}
              data-testid="button-toggle-theme"
              className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1.5 text-xs hover:border-primary/50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
