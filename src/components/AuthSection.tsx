import { useState } from "react";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthSection() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Try sign in first
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

      if (signInErr) {
        // If invalid credentials, auto-create account
        if (signInErr.message === "Invalid login credentials") {
          const { error: signUpErr } = await supabase.auth.signUp({ email, password });
          if (signUpErr) throw signUpErr;
          setSuccess(`Account created! Your login: ${email}. Bookmark https://india-ai-summit.vercel.app/ to access your profile anytime.`);
        } else {
          throw signInErr;
        }
      } else {
        setSuccess("Signed in successfully.");
      }

      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setExpanded(false);
  };

  return (
    <section className="rounded-xl border border-border overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div>
          <h3 className="text-sm font-bold font-heading">
            {user ? "Signed In" : "Save Your Preferences"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {user ? user.email : "Optional — sync across devices"}
          </p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          ) : (
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
              {success && <p className="text-xs text-green-400">{success}</p>}
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
          )}
        </div>
      )}
    </section>
  );
}
