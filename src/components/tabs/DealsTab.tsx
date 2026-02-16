import { motion } from "framer-motion";
import { dealsAndInvestments, challengeFinalists } from "@/data/summit";

export default function DealsTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">Deals & Investments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dealsAndInvestments.map((d: any, i: number) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-card border border-border highlight-border-saffron"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-bold text-sm">{d.deal}</h3>
                <span className="text-sm font-bold text-primary whitespace-nowrap">{d.amount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{d.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
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
