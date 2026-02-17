import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { personas, days } from "@/data/summit";
import { UserCircle } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import MustVisitTab from "./tabs/MustVisitTab";
import CompaniesTab from "./tabs/CompaniesTab";
import ModelsTab from "./tabs/ModelsTab";
import DealsTab from "./tabs/DealsTab";
import PavilionsTab from "./tabs/PavilionsTab";
import VenueTab from "./tabs/VenueTab";
import SurvivalTab from "./tabs/SurvivalTab";
import ProfilePanel from "./ProfilePanel";

import FloatingFeedback from "./FloatingFeedback";
import AnnouncementsBanner from "./AnnouncementsBanner";
import MeetupsTab from "./tabs/MeetupsTab";
import PeopleTab from "./tabs/PeopleTab";
import CommunityTab from "./tabs/CommunityTab";
import BottomNav, { getGroupForTab, navGroups } from "./BottomNav";

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
  { id: "meetups", label: "🤝 Meetups", icon: "🤝" },
  { id: "people", label: "👥 People", icon: "👥" },
  { id: "community", label: "💬 Community", icon: "💬" },
];

/* Sub-tab labels for mobile strip (only for multi-tab groups) */
const subTabLabels: Record<string, string> = {
  stalls: "📍 Must-Visit",
  companies: "🏢 Companies",
  models: "🧠 AI Models",
  deals: "💰 Deals",
  pavilions: "🌍 Pavilions",
  venue: "🗺️ Venue",
  meetups: "🤝 Meetups",
  people: "👥 People",
  community: "💬 Community",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfile, setShowProfile] = useState(false);
  const { clearPreferences, preferences, setPreferences } = usePreferences();
  const personaInfo = preferences?.persona ? personas[preferences.persona] : null;

  const handleDayChange = (dayId: number | null) => {
    if (preferences) {
      setPreferences({ ...preferences, visitDay: dayId });
    }
  };

  // Get current group for mobile sub-tab strip
  const activeGroup = getGroupForTab(activeTab);
  const showSubTabs = activeGroup && activeGroup.tabs.length > 1;

  return (
    <div className="min-h-screen bg-background grain-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={clearPreferences}
              className="text-lg sm:text-xl font-bold font-heading hover:opacity-80 transition-opacity"
              title="Back to Home"
            >
              <span className="text-gradient-saffron">IndiaAI</span>
              <span className="text-foreground ml-1">Summit</span>
            </button>

            {/* Role & date badges */}
            <div className="hidden sm:flex items-center gap-2">
              {personaInfo && (
                <span className="badge-for-you">
                  {personaInfo.icon} {personaInfo.label}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowProfile(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Your Profile"
          >
            <UserCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile role row */}
        <div className="sm:hidden flex items-center gap-2 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {personaInfo && (
            <span className="badge-for-you flex-shrink-0">
              {personaInfo.icon} {personaInfo.label}
            </span>
          )}
        </div>

        {/* Desktop tab bar — hidden on mobile (replaced by BottomNav) */}
        <div className="hidden md:block max-w-7xl mx-auto">
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile sub-tab strip — only visible when active group has multiple tabs */}
        {showSubTabs && (
          <div className="md:hidden overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <nav className="flex gap-1 px-4 pb-2">
              {activeGroup.tabs.map((tabId) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                    activeTab === tabId
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {subTabLabels[tabId] || tabId}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Day toggle strip */}
        <div className="flex items-center gap-1.5 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <span className="text-xs text-muted-foreground mr-1 flex-shrink-0">📅</span>
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => handleDayChange(preferences?.visitDay === d.id ? null : d.id)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                preferences?.visitDay === d.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {d.date_short}
            </button>
          ))}
          <button
            onClick={() => handleDayChange(null)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              preferences?.visitDay === null
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
        </div>
      </header>

      {/* Content — extra bottom padding on mobile for BottomNav clearance */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <AnnouncementsBanner />
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
            {activeTab === "meetups" && <MeetupsTab />}
            {activeTab === "people" && <PeopleTab />}
            {activeTab === "community" && <CommunityTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingFeedback />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Profile Panel */}
      <ProfilePanel open={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
