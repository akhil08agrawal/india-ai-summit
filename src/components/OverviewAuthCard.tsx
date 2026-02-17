import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OverviewAuthCard({ onDismiss }: { onDismiss: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

      if (signInErr) {
        if (signInErr.message === "Invalid login credentials") {
          const { error: signUpErr } = await supabase.auth.signUp({ email, password });
          if (signUpErr) throw signUpErr;
          setVerificationEmail(email);
        } else {
          throw signInErr;
        }
      }
      // If sign-in succeeded, auth context updates automatically and card hides
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("auth-card-dismissed", "true");
    onDismiss();
  };

  if (verificationEmail) {
    return (
      <div className="p-5 rounded-xl bg-card border border-primary/30 space-y-3">
        <h3 className="text-sm font-bold font-heading">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to <span className="text-foreground font-medium">{verificationEmail}</span>. Click the link to activate your account.
        </p>
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-card border border-primary/30 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold font-heading">Save Your Preferences</h3>
          <p className="text-xs text-muted-foreground">Sign in to sync across devices</p>
        </div>
        <button
          onClick={handleSkip}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-semibold disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Continue"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Signs in if you have an account, otherwise creates one automatically.
        </p>
      </form>

      <button
        onClick={handleSkip}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
      >
        Skip for now
      </button>
    </div>
  );
}
