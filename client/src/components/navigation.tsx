import { Button } from "@/components/ui/button";
import { UserPlus, Settings } from "lucide-react";
import schoolLogo from "../assets/logox.jpeg"; // ✅ Fixed

interface NavigationProps {
  currentView: "registration" | "admin";
  onViewChange: (view: "registration" | "admin") => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={schoolLogo} 
                alt="Prodigy Public School Logo" 
                className="h-8 w-8 object-contain rounded"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Prodigy Public School - MUN 2025</h1>
              <p className="text-sm text-gray-500">Model United Nations Conference</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "registration" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("registration")}
              className="text-sm font-medium"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Registration
            </Button>
            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("admin")}
              className="text-sm font-medium"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

