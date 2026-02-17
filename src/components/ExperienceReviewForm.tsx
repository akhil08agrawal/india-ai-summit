import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";

export default function ExperienceReviewForm() {
  const [overallRating, setOverallRating] = useState(0);
  const [bestPart, setBestPart] = useState("");
  const [improvement, setImprovement] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if already submitted
  useEffect(() => {
    const deviceId = getDeviceId();
    supabase
      .from("experience_reviews")
      .select("id")
      .eq("device_id", deviceId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSubmitted(true);
      });
  }, []);

  const handleSubmit = async () => {
    if (overallRating === 0) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("experience_reviews").insert({
        device_id: getDeviceId(),
        overall_rating: overallRating,
        best_part: bestPart.trim() || null,
        improvement: improvement.trim() || null,
        would_recommend: wouldRecommend,
      });
      if (error && error.code === "23505") {
        // duplicate — already submitted
        setSubmitted(true);
        return;
      }
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-5 rounded-xl bg-card border border-border border-l-4 border-l-saffron text-center">
        <p className="text-sm font-heading font-semibold">🙏 Thanks for sharing your experience!</p>
        <p className="text-xs text-muted-foreground mt-1">Your feedback helps shape the next summit.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-card border border-border border-l-4 border-l-saffron space-y-4">
      <div>
        <h2 className="text-lg font-bold font-heading">How Was Your Summit? 🇮🇳</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Share your overall experience — help shape the next one.</p>
      </div>

      {/* Overall Rating */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Overall Rating</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setOverallRating(n)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${n <= overallRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Best Part */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Best part of the summit?</label>
        <input
          type="text"
          value={bestPart}
          onChange={(e) => setBestPart(e.target.value)}
          placeholder="e.g. keynote speakers, networking..."
          className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Improvement */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">What could be improved?</label>
        <input
          type="text"
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          placeholder="e.g. better WiFi, more breaks..."
          className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Would Recommend */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Would you recommend this summit?</label>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setWouldRecommend(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              wouldRecommend === true
                ? "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setWouldRecommend(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              wouldRecommend === false
                ? "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={overallRating === 0 || loading}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-semibold disabled:opacity-50 transition-colors"
      >
        {loading ? "Submitting..." : "Share Your Experience"}
      </button>
    </div>
  );
}
