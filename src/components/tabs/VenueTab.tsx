import { motion } from "framer-motion";
import { venue } from "@/data/summit";

export default function VenueTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-1">Venue & Navigation</h2>
        <p className="text-sm text-muted-foreground mb-4">{venue.main_venue} • {(venue.expo_area_sqm / 1000).toFixed(0)}K sq.m expo area</p>

        <h3 className="font-heading font-bold text-sm mb-3 text-primary">Halls</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {venue.halls.map((h: any, i: number) => (
            <motion.div
              key={h.hall}
              className="p-4 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <h4 className="font-heading font-bold text-sm">{h.hall}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {h.known_occupant !== "Unknown" ? h.known_occupant : "Various exhibitors"}
                {h.booth && ` • Booth ${h.booth}`}
              </p>
              {h.theme && <p className="text-[10px] text-primary mt-1">{h.theme}</p>}
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-heading font-bold text-sm mb-3 text-primary">Entry Gates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {venue.entry_gates.map((g: any, i: number) => (
            <motion.div
              key={g.gate}
              className={`p-4 rounded-xl bg-card border ${g.recommended ? "border-primary" : "border-border"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm">{g.gate}</h4>
                {g.recommended && <span className="text-xs text-primary">⭐ Recommended</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">🕐 {g.hours}</p>
              <p className="text-xs text-muted-foreground">{g.access}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-heading font-bold text-sm mb-3 text-primary">Other Venues</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {venue.other_venues.map((v: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <h4 className="font-heading font-bold text-sm">{v.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{v.focus}</p>
              {v.hours && <p className="text-xs text-primary mt-1">🕐 {v.hours}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-heading font-bold text-sm mb-3 text-primary">Logistics</h3>
        <div className="p-4 rounded-xl bg-card border border-border space-y-1">
          <p className="text-xs text-muted-foreground">📋 {venue.logistics.registration}</p>
          <p className="text-xs text-muted-foreground">📅 Feb 16: {venue.logistics.feb_16}</p>
          <p className="text-xs text-muted-foreground">📅 Feb 17-20: {venue.logistics.feb_17_to_20}</p>
          <p className="text-xs text-muted-foreground">🕐 Expo: {venue.logistics.expo_hours} • Sessions: {venue.logistics.session_hours}</p>
          <p className="text-xs text-muted-foreground">🏎️ {venue.logistics.transport}</p>
          <p className="text-xs text-muted-foreground">🅿️ {venue.logistics.parking}</p>
        </div>
      </section>
    </div>
  );
}
