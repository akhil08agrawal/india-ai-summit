import { useState } from "react";
import { motion } from "framer-motion";
import { survivalTips, checklist } from "@/data/summit";

export default function SurvivalTab() {
  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const stored = sessionStorage.getItem("summit-checklist");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      try { sessionStorage.setItem("summit-checklist", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">Survival Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {survivalTips.map((tip: any, i: number) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{tip.icon}</span>
                <div>
                  <h3 className="font-heading font-bold text-sm">{tip.tip}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tip.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">Packing Checklist</h2>
        <div className="p-4 rounded-xl bg-card border border-border space-y-3">
          {checklist.map((item, i) => (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => toggleCheck(i)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                checked.has(i) ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
              }`}>
                {checked.has(i) && <span className="text-primary-foreground text-xs">✓</span>}
              </div>
              <span className={`text-sm ${checked.has(i) ? "line-through text-muted-foreground" : ""}`}>{item}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {checked.size}/{checklist.length} completed
        </p>
      </section>
    </div>
  );
}
