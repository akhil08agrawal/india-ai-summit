import { motion } from "framer-motion";
import { mustVisitByPersona, personas } from "@/data/summit";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function MustVisitTab() {
  const { preferences } = usePreferences();
  const persona = preferences?.persona || "founder";
  const stalls = mustVisitByPersona[persona] || mustVisitByPersona["founder"];
  const personaInfo = personas[persona];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading">Must-Visit Stalls</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Personalized for <span className="text-primary font-medium">{personaInfo?.icon} {personaInfo?.label}</span>
        </p>
      </div>

      <div className="space-y-3">
        {stalls.map((stall: any, i: number) => (
          <motion.div
            key={i}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary font-heading">#{stall.rank}</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm">{stall.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{stall.why}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
