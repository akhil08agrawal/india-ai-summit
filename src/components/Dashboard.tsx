import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { personas } from "@/data/summit";
import { Settings } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import MustVisitTab from "./tabs/MustVisitTab";
import CompaniesTab from "./tabs/CompaniesTab";
import ModelsTab from "./tabs/ModelsTab";
import DealsTab from "./tabs/DealsTab";
import PavilionsTab from "./tabs/PavilionsTab";
import VenueTab from "./tabs/VenueTab";
import SurvivalTab from "./tabs/SurvivalTab";

const tabs = [
  { id: "overview", label: "◉ Overview", icon: "◉" },
  { id: "schedule", label: "📅 Schedule", icon: "📅" },
  { id: "stalls", label: "📍 Must-Visit", icon: "📍" },
  { id: "companies", label: "🏢 Companies", icon: "🏢" },
  { id: "models", label: "🧠 AI Models", icon: "🧠" },
  { id: "deals", label: "💰 Deals", icon: "💰" },
  { id: "pavilions", label: "🌍 Pavilions", icon: "🌍" },
  { id: "venue", label: "🗺️ Venue", icon: "🗺️" },
  { id: "survival", label: "⚡ Tips", icon: "⚡" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { clearPreferences, preferences } = usePreferences();
  const personaInfo = preferences?.persona ? personas[preferences.persona] : null;

  return (
    <div className="min-h-screen bg-background grain-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold font-heading">
              <span className="text-gradient-saffron">IndiaAI</span>
              <span className="text-foreground ml-1">Summit</span>
            </h1>
            {personaInfo && (
              <span className="hidden sm:inline-flex badge-for-you">
                {personaInfo.icon} {personaInfo.label}
              </span>
            )}
          </div>
          <button
            onClick={clearPreferences}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Change Preferences"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto gap-1 px-4 pb-2" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="sm:hidden">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "schedule" && <ScheduleTab />}
            {activeTab === "stalls" && <MustVisitTab />}
            {activeTab === "companies" && <CompaniesTab />}
            {activeTab === "models" && <ModelsTab />}
            {activeTab === "deals" && <DealsTab />}
            {activeTab === "pavilions" && <PavilionsTab />}
            {activeTab === "venue" && <VenueTab />}
            {activeTab === "survival" && <SurvivalTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
