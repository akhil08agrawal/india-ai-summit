import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const COMMUNITY_LINK = "https://chat.whatsapp.com/J35U2z7CELI84NfbDdiAjf";

const groups = [
  {
    name: "Founders & AI Builders",
    emoji: "🚀",
    link: "https://chat.whatsapp.com/I6Bmhik4X5t56Y9Ozod4Ts?mode=gi_t",
    who: ["Startup founders", "AI engineers & builders", "Product leaders"],
    focus: ["Building AI products", "Fundraising & GTM", "Technical deep-dives"],
  },
  {
    name: "Core AI / Research / Infra",
    emoji: "🧠",
    link: "https://chat.whatsapp.com/KKSpt5RdinrIO7rsOBSkuK?mode=gi_t",
    who: ["ML researchers", "Infra & platform engineers", "Academics"],
    focus: ["Model training & fine-tuning", "MLOps & inference", "Papers & benchmarks"],
  },
  {
    name: "Physical AI / Hardware / Robotics",
    emoji: "🏭",
    link: "https://chat.whatsapp.com/JmLAConu9sdF88Os3Z02xc?mode=gi_t",
    who: ["Robotics engineers", "Hardware designers", "Manufacturing leaders"],
    focus: ["Embodied AI & robotics", "Edge compute & chips", "Industrial automation"],
  },
  {
    name: "Enterprise AI & Transformation",
    emoji: "🏢",
    link: "https://chat.whatsapp.com/BolGEqNRbmQKQUrKFpcOvY?mode=gi_t",
    who: ["Enterprise leaders", "Digital transformation heads", "Solution architects"],
    focus: ["AI adoption at scale", "Workflow automation", "Change management"],
  },
  {
    name: "Finance / Quant / Fintech AI",
    emoji: "💰",
    link: "https://chat.whatsapp.com/HxzIa1uYrA9JrQIicMQaHk?mode=gi_t",
    who: ["Quant traders & analysts", "Fintech founders", "Risk & compliance pros"],
    focus: ["Algorithmic trading", "Credit & fraud AI", "RegTech & compliance"],
  },
  {
    name: "Impact / GovTech / Climate AI",
    emoji: "🌍",
    link: "https://chat.whatsapp.com/B9wAZfZ4VOQKEdX2k0V3pq?mode=gi_t",
    who: ["Policy & GovTech leaders", "Climate tech founders", "Social impact builders"],
    focus: ["AI for public good", "Sustainability & climate", "Digital public infra"],
  },
];

export default function CommunityTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-heading">💬 WhatsApp Community</h2>
      <p className="text-sm text-muted-foreground">
        Stay connected after the summit! Join our WhatsApp Community and the industry groups that match your interests.
      </p>

      {/* Main community join button */}
      <a
        href={COMMUNITY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        Join the WhatsApp Community
      </a>

      {/* Group cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((group, i) => (
          <motion.div
            key={group.name}
            className="p-5 rounded-xl bg-card border border-border flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-sm font-semibold mb-2">
              {group.emoji} {group.name}
            </h3>

            <p className="text-xs font-medium text-muted-foreground mb-1">Who</p>
            <ul className="text-sm text-muted-foreground mb-2 space-y-0.5">
              {group.who.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>

            <p className="text-xs font-medium text-muted-foreground mb-1">Focus</p>
            <ul className="text-sm text-muted-foreground mb-3 space-y-0.5">
              {group.focus.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <a
              href={group.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Join Group
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
