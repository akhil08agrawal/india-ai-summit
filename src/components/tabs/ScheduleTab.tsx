import { useState } from "react";
import { motion } from "framer-motion";
import { days, getScheduleForDay, isForYou, interestTags } from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function ScheduleTab() {
  const { preferences } = usePreferences();
  const defaultDay = preferences?.visitDay || 4;
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const sessions = getScheduleForDay(selectedDay);
  const userInterests = preferences?.interests || [];

  const sorted = [...sessions].sort((a, b) => {
    const aMatch = isForYou(a.tags, userInterests);
    const bMatch = isForYou(b.tags, userInterests);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-heading">Schedule</h2>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {days.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDay === d.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-bold">{d.date_short}</span>
            <span className="hidden sm:inline ml-1 text-xs">({d.weekday})</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{days.find(d => d.id === selectedDay)?.title}</p>

      {/* Sessions */}
      <div className="space-y-3">
        {sorted.map((session, i) => {
          const forYou = isForYou(session.tags, userInterests);
          return (
            <motion.div
              key={i}
              className={`p-4 rounded-xl bg-card border border-border ${session.is_highlight ? "highlight-border-saffron" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-primary font-mono font-medium">{session.time}</span>
                    {forYou && <span className="badge-for-you">✦ For You</span>}
                    {session.is_highlight && <span className="text-xs text-saffron font-medium">★ Keynote</span>}
                  </div>
                  <h3 className="font-heading font-bold text-sm mt-1">{session.session}</h3>
                  {session.venue && <p className="text-xs text-muted-foreground mt-1">📍 {session.venue}</p>}
                  {session.speakers && <p className="text-xs text-muted-foreground mt-1">🎤 {session.speakers}</p>}
                </div>
              </div>
              {session.tags && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {session.tags.map((t: string) => {
                    const tag = interestTags.find(it => it.id === t);
                    return tag ? (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tag.icon} {tag.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
