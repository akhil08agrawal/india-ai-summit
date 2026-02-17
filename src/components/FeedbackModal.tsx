import { useState } from "react";
import { X, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  page?: string;
}

export default function FeedbackModal({ open, onClose, page }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await supabase.from("feedback").insert({
        device_id: getDeviceId(),
        rating,
        message: message.trim() || null,
        page: page || null,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setMessage("");
      }, 2000);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-card border border-border p-5 space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">🙏</p>
            <p className="text-sm font-heading font-semibold">Thanks for your feedback!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading">Share Feedback</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any comments? (optional)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
