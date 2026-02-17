import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { personas, interestTags, days, lookingForTags } from "@/data/summit";
import AuthSection from "./AuthSection";

const personaKeys = Object.keys(personas);

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { preferences, setPreferences, clearPreferences } = usePreferences();

  const [persona, setPersona] = useState(preferences?.persona || null);
  const [interests, setInterests] = useState<string[]>(preferences?.interests || []);
  const [visitDay, setVisitDay] = useState<number | null>(preferences?.visitDay || null);
  const [whatsapp, setWhatsapp] = useState(preferences?.whatsapp || "");
  const [workingOn, setWorkingOn] = useState(preferences?.workingOn || "");
  const [lookingFor, setLookingFor] = useState<string[]>(preferences?.lookingFor || []);

  // Sync when panel opens
  useEffect(() => {
    if (open && preferences) {
      setPersona(preferences.persona);
      setInterests(preferences.interests);
      setVisitDay(preferences.visitDay);
      setWhatsapp(preferences.whatsapp || "");
      setWorkingOn(preferences.workingOn || "");
      setLookingFor(preferences.lookingFor || []);
    }
  }, [open, preferences]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleLookingFor = (id: string) => {
    setLookingFor((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (persona && interests.length > 0) {
      setPreferences({
        persona,
        interests,
        visitDay,
        whatsapp: whatsapp || null,
        workingOn: workingOn || null,
        lookingFor,
      });
      onClose();
    }
  };

  const handleReset = () => {
    clearPreferences();
    onClose();
  };

  const personaInfo = persona ? personas[persona] : null;
  const visitDayInfo = visitDay ? days.find(d => d.id === visitDay) : null;
  const canSave = persona && interests.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold font-heading">Your Profile</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Optional Auth */}
              <AuthSection />

              {/* Current summary */}
              {personaInfo && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1">
                  <p className="text-sm font-medium">
                    {personaInfo.icon} {personaInfo.label}
                  </p>
                  {visitDayInfo && (
                    <p className="text-xs text-muted-foreground">
                      📅 Visiting {visitDayInfo.date_short} ({visitDayInfo.weekday}) — {visitDayInfo.title}
                    </p>
                  )}
                  {!visitDayInfo && (
                    <p className="text-xs text-muted-foreground">📅 Viewing all days</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {interests.length} interest{interests.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}

              {/* Persona */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">Who are you?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {personaKeys.map((key) => {
                    const p = personas[key];
                    const selected = persona === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setPersona(key)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-xs font-medium">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Interests */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">Your Interests</h3>
                <div className="grid grid-cols-1 gap-2">
                  {interestTags.map((tag) => {
                    const selected = interests.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleInterest(tag.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-lg">{tag.icon}</span>
                        <span className="text-xs font-medium">{tag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Visit Day */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">Visit Day</h3>
                <div className="grid grid-cols-1 gap-2">
                  {days.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setVisitDay(visitDay === d.id ? null : d.id)}
                      className={`flex flex-col p-3 rounded-xl border-2 transition-all text-left ${
                        visitDay === d.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-xs font-bold text-primary">{d.date_short} ({d.weekday})</span>
                      <span className="text-xs text-muted-foreground">{d.title}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setVisitDay(null)}
                    className={`p-3 rounded-xl border-2 transition-all text-left text-xs font-medium ${
                      visitDay === null
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    Show All Days
                  </button>
                </div>
              </section>

              {/* WhatsApp */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">WhatsApp Number</h3>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 rounded-lg bg-muted text-sm text-muted-foreground border border-border">+91</span>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Visible in attendee directory</p>
              </section>

              {/* Working on */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">What are you working on?</h3>
                <textarea
                  value={workingOn}
                  onChange={(e) => setWorkingOn(e.target.value.slice(0, 200))}
                  placeholder="e.g. Building an AI-powered legal assistant"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </section>

              {/* Looking for */}
              <section>
                <h3 className="text-sm font-bold font-heading mb-3">Looking for</h3>
                <div className="flex flex-wrap gap-2">
                  {lookingForTags.map((tag) => {
                    const selected = lookingFor.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleLookingFor(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-muted-foreground/50"
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-border flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
