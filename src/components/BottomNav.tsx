import { Home, CalendarDays, Search, Users } from "lucide-react";

export interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  tabs: string[];
}

export const navGroups: NavGroup[] = [
  { id: "overview", label: "Overview", icon: <Home className="w-5 h-5" />, tabs: ["overview"] },
  { id: "schedule", label: "Schedule", icon: <CalendarDays className="w-5 h-5" />, tabs: ["schedule"] },
  { id: "explore", label: "Explore", icon: <Search className="w-5 h-5" />, tabs: ["stalls", "companies", "models", "pavilions", "venue"] },
  { id: "connect", label: "Connect", icon: <Users className="w-5 h-5" />, tabs: ["community"] },
];

/** Returns the nav group that contains the given tab ID */
export function getGroupForTab(tabId: string): NavGroup | undefined {
  return navGroups.find((g) => g.tabs.includes(tabId));
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const activeGroup = getGroupForTab(activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-xl border-t border-border h-16 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {navGroups.map((group) => {
          const isActive = activeGroup?.id === group.id;
          return (
            <button
              key={group.id}
              onClick={() => {
                // If already in this group, stay on current tab; otherwise go to first tab
                if (!isActive) {
                  onTabChange(group.tabs[0]);
                }
              }}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-b-full" />
              )}
              {group.icon}
              <span className="text-[10px] font-medium leading-none">{group.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
