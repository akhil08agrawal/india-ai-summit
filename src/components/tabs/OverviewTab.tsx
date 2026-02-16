import { motion } from "framer-motion";
import {
  headlineStats, keynoteSpeakers, mustVisitByPersona, personas,
  getScheduleForDay, isForYou, interestTags, days,
  companiesGlobal, companiesIndian, foundationModels, dealsAndInvestments
} from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function OverviewTab() {
  const { preferences } = usePreferences();
  const userInterests = preferences?.interests || [];
  const persona = preferences?.persona || "founder";
  const visitDay = preferences?.visitDay;
  const personaInfo = personas[persona];

  // For You sessions — from visit day or all days
  const daysToShow = visitDay ? [visitDay] : [1, 2, 3, 4, 5];
  const allSessions = daysToShow.flatMap(d => {
    const sessions = getScheduleForDay(d);
    return sessions.map((s: any) => ({ ...s, dayId: d }));
  });
  const forYouSessions = allSessions
    .filter((s: any) => isForYou(s.tags, userInterests))
    .slice(0, 5);

  // For You companies
  const allCompanies = [...companiesGlobal, ...companiesIndian];
  const forYouCompanies = allCompanies
    .filter((c: any) => isForYou(c.tags, userInterests))
    .slice(0, 6);

  // For You models
  const forYouModels = foundationModels
    .filter((m: any) => isForYou(m.tags, userInterests))
    .slice(0, 4);

  // Top stalls for persona
  const topStalls = (mustVisitByPersona[persona] || []).slice(0, 5);

  // Top deals
  const topDeals = dealsAndInvestments.slice(0, 4);

  // Visit day info
  const visitDayInfo = visitDay ? days.find(d => d.id === visitDay) : null;

  return (
    <div className="space-y-10">
      {/* Welcome / For You header */}
      <section>
        <motion.div
          className="p-5 rounded-xl bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            ✦ Your Summit at a Glance
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized for {personaInfo?.icon} <span className="text-foreground font-medium">{personaInfo?.label}</span>
            {visitDayInfo && (
              <> · Visiting <span className="text-primary font-medium">{visitDayInfo.date_short} ({visitDayInfo.weekday})</span></>
            )}
            {!visitDayInfo && <> · All 5 days</>}
            {" "}· {userInterests.length} interest{userInterests.length !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {userInterests.map(id => {
              const tag = interestTags.find(t => t.id === id);
              return tag ? (
                <span key={id} className="badge-for-you text-[10px]">{tag.icon} {tag.label}</span>
              ) : null;
            })}
          </div>
        </motion.div>
      </section>

      {/* Stats — compact row */}
      <section>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {headlineStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-3 rounded-xl bg-card border border-border text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-lg sm:text-xl font-bold font-heading text-gradient-saffron">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For You Sessions */}
      {forYouSessions.length > 0 && (
        <section>
          <SectionTitle>✦ Sessions For You</SectionTitle>
          <div className="space-y-2">
            {forYouSessions.map((s: any, i: number) => {
              const dayInfo = days.find(d => d.id === s.dayId);
              return (
                <motion.div
                  key={i}
                  className={`p-4 rounded-xl bg-card border border-border ${s.is_highlight ? "highlight-border-saffron" : ""}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{dayInfo?.date_short}</span>
                    <span className="text-xs text-primary font-mono font-medium">{s.time}</span>
                    {s.is_highlight && <span className="text-xs text-saffron font-medium">★</span>}
                  </div>
                  <h3 className="font-heading font-bold text-sm mt-1">{s.session}</h3>
                  {s.venue && <p className="text-xs text-muted-foreground mt-0.5">📍 {s.venue}</p>}
                  {s.speakers && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">🎤 {s.speakers}</p>}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Top Stalls for Persona */}
      <section>
        <SectionTitle>📍 Top Stalls for {personaInfo?.label || "You"}</SectionTitle>
        <div className="space-y-2">
          {topStalls.map((stall: any, i: number) => (
            <motion.div
              key={i}
              className="flex gap-3 p-3 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary font-heading">#{stall.rank}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-sm">{stall.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{stall.why}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For You Companies */}
      {forYouCompanies.length > 0 && (
        <section>
          <SectionTitle>✦ Companies Matching Your Interests</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {forYouCompanies.map((c: any, i: number) => (
              <motion.div
                key={c.name}
                className="p-3 rounded-xl bg-card border border-primary/30 space-y-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <h3 className="font-heading font-bold text-sm">{c.name}</h3>
                {c.key_person && <p className="text-[10px] text-primary">{c.key_person}</p>}
                <p className="text-xs text-muted-foreground line-clamp-2">{c.showcase}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* For You Models */}
      {forYouModels.length > 0 && (
        <section>
          <SectionTitle>✦ AI Models For You</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {forYouModels.map((m: any, i: number) => (
              <motion.div
                key={m.id}
                className="p-3 rounded-xl bg-card border border-primary/30 space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <h3 className="font-heading font-bold text-sm">{m.developer}</h3>
                <p className="text-xs text-primary font-medium">{m.model_name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{m.focus}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Keynotes */}
      <section>
        <SectionTitle>🎤 Keynote Speakers</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {keynoteSpeakers.map((s, i) => (
            <motion.div
              key={s.name}
              className="p-3 rounded-xl bg-card border border-border space-y-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="text-xl">{s.icon}</span>
              <h3 className="font-heading font-bold text-sm">{s.name}</h3>
              <p className="text-[10px] text-muted-foreground">{s.role}</p>
              <p className="text-[10px] text-primary font-medium">{s.day}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Deals */}
      <section>
        <SectionTitle>💰 Major Deals</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {topDeals.map((d: any, i: number) => (
            <motion.div
              key={i}
              className="p-3 rounded-xl bg-card border border-border highlight-border-saffron"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-bold text-sm">{d.deal}</h3>
                <span className="text-sm font-bold text-primary whitespace-nowrap">{d.amount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{d.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg sm:text-xl font-bold font-heading mb-3">{children}</h2>;
}
