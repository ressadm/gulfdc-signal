import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import NotFound from "@/pages/not-found";
import WeeklyBrief from "@/pages/WeeklyBrief";
import MarketDashboard from "@/pages/MarketDashboard";
import SupplyTracker from "@/pages/SupplyTracker";
import DemandSignals from "@/pages/DemandSignals";
import Regulation from "@/pages/Regulation";
import Partnerships from "@/pages/Partnerships";
import Strategy from "@/pages/Strategy";
import WeakSignals from "@/pages/WeakSignals";
import Console from "@/pages/Console";
import Archives from "@/pages/Archives";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={WeeklyBrief} />
      <Route path="/dashboard" component={MarketDashboard} />
      <Route path="/supply" component={SupplyTracker} />
      <Route path="/demand" component={DemandSignals} />
      <Route path="/regulation" component={Regulation} />
      <Route path="/partnerships" component={Partnerships} />
      <Route path="/strategy" component={Strategy} />
      <Route path="/weak-signals" component={WeakSignals} />
      <Route path="/console" component={Console} />
      <Route path="/archives" component={Archives} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppShell>
              <AppRouter />
            </AppShell>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
