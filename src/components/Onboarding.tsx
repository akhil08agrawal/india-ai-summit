import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personas, interestTags, days } from "@/data/summit";
import { usePreferences, Preferences } from "@/contexts/PreferencesContext";

const personaKeys = Object.keys(personas);

export default function Onboarding() {
  const { setPreferences } = usePreferences();
  const [step, setStep] = useState(0); // 0=hero, 1=persona, 2=interests, 3=day
  const [persona, setPersona] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [visitDay, setVisitDay] = useState<number | null>(null);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const finish = (day: number | null) => {
    setPreferences({ persona, interests, visitDay: day });
  };

  const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay">
      {/* Floating orbs */}
      <div className="orb orb-saffron w-72 h-72 -top-20 -left-20 animate-float" />
      <div className="orb orb-green w-96 h-96 -bottom-32 -right-32 animate-float" style={{ animationDelay: "3s" }} />
      <div className="orb orb-saffron w-48 h-48 top-1/3 right-10 animate-float" style={{ animationDelay: "1.5s", opacity: 0.15 }} />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="hero"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Feb 16–20, 2026 • Bharat Mandapam, New Delhi
                </p>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-heading leading-[0.9] tracking-tight">
                  <span className="text-shimmer">INDIA AI</span>
                  <br />
                  <span className="text-foreground">IMPACT</span>
                  <br />
                  <motion.span
                    className="text-gradient-saffron"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    SUMMIT
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p
                className="text-lg text-muted-foreground max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Your personalized guide to the world's largest AI summit.
                <br />
                Answer 3 quick questions to get started.
              </motion.p>

              <motion.button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-lg hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started →
              </motion.button>

              <motion.div
                className="flex justify-center gap-6 flex-wrap pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {["20+ Heads of State", "250K+ Visitors", "3,250+ Speakers", "$68B+ Invested"].map((s) => (
                  <span key={s} className="text-xs text-muted-foreground font-medium tracking-wide">{s}</span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="q1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <StepHeader step={1} total={3} title="Who are you?" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {personaKeys.map((key) => {
                  const p = personas[key];
                  const selected = persona === key;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => { setPersona(key); setTimeout(() => setStep(2), 300); }}
                      className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-3xl">{p.icon}</span>
                      <span className="text-sm font-medium text-center">{p.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="q2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <StepHeader step={2} total={3} title="What interests you most?" subtitle="Select all that apply" />
              <div className="grid grid-cols-2 gap-3">
                {interestTags.map((tag) => {
                  const selected = interests.includes(tag.id);
                  return (
                    <motion.button
                      key={tag.id}
                      onClick={() => toggleInterest(tag.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-2xl">{tag.icon}</span>
                      <span className="text-sm font-medium">{tag.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
                <motion.button
                  onClick={() => setStep(3)}
                  disabled={interests.length === 0}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue →
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="q3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <StepHeader step={3} total={3} title="Which day are you visiting?" subtitle="Optional — skip to see everything" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {days.map((d) => (
                  <motion.button
                    key={d.id}
                    onClick={() => { setVisitDay(d.id); finish(d.id); }}
                    className="flex flex-col p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-sm font-bold text-primary">{d.date_short} ({d.weekday})</span>
                    <span className="text-sm text-muted-foreground mt-1">{d.title}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
                <motion.button
                  onClick={() => finish(null)}
                  className="px-6 py-3 rounded-full border-2 border-border text-foreground font-heading font-semibold hover:border-muted-foreground/50"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Skip — Show Everything
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < step ? "w-8 bg-primary" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{step}/{total}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold font-heading">{title}</h2>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
