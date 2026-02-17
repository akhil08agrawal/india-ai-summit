import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, CalendarPlus, Download } from "lucide-react";
import { days, getScheduleForDay, getRecommendationLevel, interestTags, getTodaysDayId } from "@/data/summit";
import type { RecommendationLevel } from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useBookmarks, makeBookmarkId } from "@/contexts/BookmarksContext";
import type { BookmarkEntry } from "@/contexts/BookmarksContext";
import { downloadSingleICS, downloadICS } from "@/lib/ics";

const recBadge: Record<Exclude<RecommendationLevel, null>, { label: string; className: string }> = {
  must_attend: { label: "🔥 Must Attend", className: "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30" },
  recommended: { label: "👍 Recommended", className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30" },
  explore: { label: "✨ Explore", className: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30" },
};

const recOrder: Record<string, number> = { must_attend: 0, recommended: 1, explore: 2 };

export default function ScheduleTab() {
  const { preferences } = usePreferences();
  const { toggle, isBookmarked, getAll, count } = useBookmarks();
  const defaultDay = preferences?.visitDay || getTodaysDayId() || 4;
  const [selectedDay, setSelectedDay] = useState<number | "saved">(defaultDay);

  const userInterests = preferences?.interests || [];

  // Build session list
  let displaySessions: { session: any; dayId: number; rec: RecommendationLevel; bookmarkId: string }[] = [];

  if (selectedDay === "saved") {
    const all = getAll();
    displaySessions = Object.entries(all).map(([id, entry]) => ({
      session: { time: entry.time, session: entry.title, venue: entry.venue, speakers: entry.speakers, tags: entry.tags, is_highlight: entry.is_highlight },
      dayId: entry.dayId,
      rec: getRecommendationLevel(entry.tags || [], userInterests),
      bookmarkId: id,
    }));
    displaySessions.sort((a, b) => a.dayId - b.dayId);
  } else {
    const sessions = getScheduleForDay(selectedDay);
    displaySessions = sessions.map((s: any) => {
      const entry: BookmarkEntry = { dayId: selectedDay, time: s.time, title: s.session, venue: s.venue, speakers: s.speakers, tags: s.tags, is_highlight: s.is_highlight };
      return {
        session: s,
        dayId: selectedDay,
        rec: getRecommendationLevel(s.tags, userInterests),
        bookmarkId: makeBookmarkId(entry),
      };
    });
    displaySessions.sort((a, b) => {
      const aR = a.rec ? recOrder[a.rec] ?? 3 : 3;
      const bR = b.rec ? recOrder[b.rec] ?? 3 : 3;
      return aR - bR;
    });
  }

  // Group by day for "saved" view
  const groupedByDay = selectedDay === "saved"
    ? displaySessions.reduce((acc, item) => {
        (acc[item.dayId] = acc[item.dayId] || []).push(item);
        return acc;
      }, {} as Record<number, typeof displaySessions>)
    : null;

  function handleExportAll() {
    const all = getAll();
    downloadICS(Object.values(all));
  }

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
        <button
          onClick={() => setSelectedDay("saved")}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedDay === "saved"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          ⭐ Saved ({count})
        </button>
      </div>

      {selectedDay !== "saved" && (
        <p className="text-sm text-muted-foreground">{days.find(d => d.id === selectedDay)?.title}</p>
      )}

      {selectedDay === "saved" && count > 0 && (
        <button
          onClick={handleExportAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export All Saved (.ics)
        </button>
      )}

      {selectedDay === "saved" && count === 0 && (
        <p className="text-sm text-muted-foreground">No saved sessions yet. Tap the bookmark icon on any session to save it.</p>
      )}

      {/* Sessions */}
      {groupedByDay ? (
        Object.entries(groupedByDay).map(([dayIdStr, items]) => {
          const dayId = parseInt(dayIdStr);
          const dayInfo = days.find(d => d.id === dayId);
          return (
            <div key={dayId} className="space-y-3">
              <h3 className="text-sm font-bold text-primary">{dayInfo?.date_short} ({dayInfo?.weekday}) — {dayInfo?.title}</h3>
              {items.map((item, i) => (
                <SessionCard key={item.bookmarkId} item={item} i={i} userInterests={userInterests} toggle={toggle} isBookmarked={isBookmarked} />
              ))}
            </div>
          );
        })
      ) : (
        <div className="space-y-3">
          {displaySessions.map((item, i) => (
            <SessionCard key={item.bookmarkId} item={item} i={i} userInterests={userInterests} toggle={toggle} isBookmarked={isBookmarked} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ item, i, userInterests, toggle, isBookmarked }: {
  item: { session: any; dayId: number; rec: RecommendationLevel; bookmarkId: string };
  i: number;
  userInterests: string[];
  toggle: (entry: BookmarkEntry) => void;
  isBookmarked: (id: string) => boolean;
}) {
  const { session, dayId, rec, bookmarkId } = item;
  const entry: BookmarkEntry = { dayId, time: session.time, title: session.session, venue: session.venue, speakers: session.speakers, tags: session.tags, is_highlight: session.is_highlight };
  const saved = isBookmarked(bookmarkId);

  return (
    <motion.div
      className={`p-4 rounded-xl bg-card border border-border ${session.is_highlight ? "highlight-border-saffron" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-primary font-mono font-medium">{session.time}</span>
            {rec && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${recBadge[rec].className}`}>
                {recBadge[rec].label}
              </span>
            )}
            {session.is_highlight && <span className="text-xs text-saffron font-medium">★ Keynote</span>}
          </div>
          <h3 className="font-heading font-bold text-sm mt-1">{session.session}</h3>
          {session.venue && <p className="text-xs text-muted-foreground mt-1">📍 {session.venue}</p>}
          {session.speakers && <p className="text-xs text-muted-foreground mt-1">🎤 {session.speakers}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => downloadSingleICS(entry)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Add to calendar"
          >
            <CalendarPlus className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => toggle(entry)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title={saved ? "Remove bookmark" : "Bookmark session"}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4 text-muted-foreground" />}
          </button>
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
}
