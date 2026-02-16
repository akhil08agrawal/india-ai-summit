import { motion } from "framer-motion";
import { countryPavilions } from "@/data/summit";

export default function PavilionsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-heading">Country Pavilions</h2>
      <p className="text-sm text-muted-foreground">13 nations showcasing AI capabilities</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {countryPavilions.map((p: any, i: number) => (
          <motion.div
            key={p.country}
            className="p-4 rounded-xl bg-card border border-border space-y-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{p.flag}</span>
              <h3 className="font-heading font-bold text-sm">{p.country}</h3>
            </div>
            {p.hall && p.hall !== "TBC" && (
              <p className="text-xs text-primary font-medium">📍 {p.hall}{p.size_sqm ? ` (${p.size_sqm} sq.m)` : ""}</p>
            )}
            {p.companies_count && (
              <p className="text-xs text-muted-foreground">{p.companies_count} companies</p>
            )}
            <p className="text-xs text-muted-foreground">{p.highlight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
