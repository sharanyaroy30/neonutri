import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import BabyProfile from "@/pages/baby-profile";
import FeedingRecommendations from "@/pages/feeding-recommendations";
import FeedingLog from "@/pages/feeding-log";
import GrowthTracker from "@/pages/growth-tracker";
import { useState, useEffect } from "react";

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar currentPath={location} />
      
      <div className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={BabyProfile} />
          <Route path="/profile" component={BabyProfile} />
          <Route path="/recommendations" component={FeedingRecommendations} />
          <Route path="/log" component={FeedingLog} />
          <Route path="/growth" component={GrowthTracker} />
          <Route component={NotFound} />
        </Switch>
        
        <MobileNav currentPath={location} />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
