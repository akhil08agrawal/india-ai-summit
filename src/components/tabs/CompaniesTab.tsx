import { useState } from "react";
import { motion } from "framer-motion";
import { companiesGlobal, companiesIndian, isForYou, interestTags, challengeFinalists } from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";

type Filter = "all" | "global" | "indian";

export default function CompaniesTab() {
  const [filter, setFilter] = useState<Filter>("all");
  const { preferences } = usePreferences();
  const userInterests = preferences?.interests || [];

  const companies =
    filter === "global" ? companiesGlobal :
    filter === "indian" ? companiesIndian :
    [...companiesGlobal, ...companiesIndian];

  const sorted = [...companies].sort((a, b) => {
    const am = isForYou(a.tags, userInterests);
    const bm = isForYou(b.tags, userInterests);
    if (am && !bm) return -1;
    if (!am && bm) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-heading">Companies</h2>

      <div className="flex gap-2">
        {(["all", "global", "indian"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "global" ? "🌐 Global Tech" : "🇮🇳 Indian"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((c, i) => {
          const forYou = isForYou(c.tags, userInterests);
          return (
            <motion.div
              key={c.name}
              className={`p-4 rounded-xl bg-card border ${forYou ? "border-primary/40" : "border-border"}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-bold text-sm">{c.name}</h3>
                {forYou && <span className="badge-for-you text-[10px]">✦ For You</span>}
              </div>
              {c.key_person && <p className="text-xs text-primary mt-1">{c.key_person}</p>}
              {c.booth && <p className="text-xs text-primary font-medium mt-1">📍 {c.booth}</p>}
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.showcase}</p>
              {c.contact && (
                <div className="flex items-center gap-3 mt-1.5">
                  {c.contact.email && <a href={`mailto:${c.contact.email}`} className="text-xs text-muted-foreground hover:text-primary">✉️ Email</a>}
                  {c.contact.phone && <a href={`tel:${c.contact.phone}`} className="text-xs text-muted-foreground hover:text-primary">📞 Call</a>}
                </div>
              )}
              {c.tags && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.tags.map((t: string) => {
                    const tag = interestTags.find(it => it.id === t);
                    return tag ? (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{tag.icon}</span>
                    ) : null;
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Challenge Finalists */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">Challenge Finalists</h2>
        {Object.values(challengeFinalists).map((challenge: any, ci: number) => (
          <div key={ci} className="mb-6">
            <h3 className="font-heading font-bold text-sm text-primary mb-2">{challenge.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              {challenge.applications} applications • {challenge.countries || challenge.age_range} • {challenge.finalists} finalists
              {challenge.prize && ` • Prize: ${challenge.prize}`}
            </p>
            {challenge.named_finalists && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challenge.named_finalists.map((f: any, fi: number) => (
                  <div key={fi} className="p-3 rounded-lg bg-card border border-border">
                    <h4 className="text-sm font-bold">
                      {f.name}
                      {f.country && <span className="text-xs text-muted-foreground font-normal ml-1">({f.country})</span>}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.what}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
