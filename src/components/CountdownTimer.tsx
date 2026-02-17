import { useCountdown } from "@/hooks/useCountdown";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
  const { label, timeLeft } = useCountdown();

  if (!label || !timeLeft) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/30">
      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Next session</p>
        <p className="text-sm font-heading font-bold truncate">{label}</p>
      </div>
      <span className="text-sm font-mono font-bold text-primary whitespace-nowrap">
        in {timeLeft}
      </span>
    </div>
  );
}
