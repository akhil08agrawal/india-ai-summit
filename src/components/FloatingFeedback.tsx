import { useState, useEffect } from "react";

export default function FloatingFeedback() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="https://forms.gle/bJ6FnFmXK383Vzk46"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-20 sm:bottom-6 right-4 z-40 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-card border-2 border-saffron text-sm font-medium text-foreground shadow-lg hover:shadow-saffron/30 hover:scale-105 transition-all duration-300 ${pulse ? "animate-pulse shadow-saffron/40" : ""}`}
    >
      ⚡ Share Feedback
    </a>
  );
}
