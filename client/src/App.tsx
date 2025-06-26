import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import RegistrationPage from "@/pages/registration";
import AdminPage from "@/pages/admin";

function App() {
  const [currentView, setCurrentView] = useState<"registration" | "admin">("registration");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
          
          {currentView === "registration" ? (
            <RegistrationPage />
          ) : (
            <AdminPage />
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
