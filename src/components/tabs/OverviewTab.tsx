import { motion } from "framer-motion";
import { headlineStats, keynoteSpeakers, governanceSutras, sevenChakras } from "@/data/summit";

const takeaways = [
  { title: "India's $100B+ AI infrastructure play", desc: "Google, Microsoft, Amazon committing massive capital" },
  { title: "Voice-first multilingual AI", desc: "The next frontier — India leading in 22+ languages" },
  { title: "India is #2 market for OpenAI & Anthropic", desc: "100M+ weekly ChatGPT users from India" },
  { title: "Innovation over Restraint governance", desc: "India's 7-sutra approach to AI regulation" },
  { title: "Feb 19 is THE day", desc: "All major keynotes and plenary sessions" },
];

export default function OverviewTab() {
  return (
    <div className="space-y-10">
      {/* Stats */}
      <section>
        <SectionTitle>At a Glance</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {headlineStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl bg-card border border-border text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl sm:text-3xl font-bold font-heading text-gradient-saffron">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keynotes */}
      <section>
        <SectionTitle>Keynote Speakers</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {keynoteSpeakers.map((s, i) => (
            <motion.div
              key={s.name}
              className="p-4 rounded-xl bg-card border border-border space-y-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-heading font-bold text-sm">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.role}</p>
              <p className="text-xs text-primary font-medium">{s.day}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{s.topic}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7 Sutras */}
      <section>
        <SectionTitle>7 Governance Sutras</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {governanceSutras.map((s: any, i: number) => (
            <motion.div
              key={s.num}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <span className="text-xs text-primary font-bold">#{s.num}</span>
                <p className="text-sm font-medium">{s.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Takeaways */}
      <section>
        <SectionTitle>Key Takeaways</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {takeaways.map((t, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-card border border-border highlight-border-saffron"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <h3 className="font-heading font-bold text-sm">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">{children}</h2>;
}
