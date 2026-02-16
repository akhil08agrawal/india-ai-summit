import { motion } from "framer-motion";
import { foundationModels, isForYou, interestTags } from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function ModelsTab() {
  const { preferences } = usePreferences();
  const userInterests = preferences?.interests || [];

  const sorted = [...foundationModels].sort((a, b) => {
    const am = isForYou(a.tags, userInterests);
    const bm = isForYou(b.tags, userInterests);
    if (am && !bm) return -1;
    if (!am && bm) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading">IndiaAI Foundation Models</h2>
        <p className="text-sm text-muted-foreground">12 indigenous AI models launched under the IndiaAI Mission</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((m, i) => {
          const forYou = isForYou(m.tags, userInterests);
          return (
            <motion.div
              key={m.id}
              className={`p-4 rounded-xl bg-card border ${forYou ? "border-primary/40" : "border-border"} space-y-2`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-bold text-sm">{m.developer}</h3>
                {forYou && <span className="badge-for-you text-[10px]">✦ For You</span>}
              </div>
              <p className="text-xs text-primary font-medium">{m.model_name}</p>
              {m.parameters && <p className="text-xs text-muted-foreground">Parameters: {m.parameters}</p>}
              <p className="text-xs text-muted-foreground line-clamp-2">{m.focus}</p>
              {m.funding && <p className="text-[10px] text-india-green font-medium">💰 {m.funding}</p>}
              {m.tags && (
                <div className="flex gap-1 flex-wrap">
                  {m.tags.map((t: string) => {
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
    </div>
  );
}
