import { useActivePolls, useVote, PollWithResults } from "@/hooks/usePolls";
import { motion } from "framer-motion";

export default function PollsSection() {
  const { data: polls } = useActivePolls();

  if (!polls || polls.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold font-heading mb-3">📊 Live Polls</h2>
      <div className="space-y-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </section>
  );
}

function PollCard({ poll }: { poll: PollWithResults }) {
  const voteMutation = useVote();
  const hasVoted = poll.myVote !== null;

  const handleVote = (optionIndex: number) => {
    if (hasVoted || voteMutation.isPending) return;
    voteMutation.mutate({ pollId: poll.id, optionIndex });
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-heading font-bold text-sm mb-3">{poll.question}</h3>

      <div className="space-y-2">
        {poll.options.map((option, i) => {
          const count = poll.votes[i] || 0;
          const pct = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;
          const isMyVote = poll.myVote === i;

          if (hasVoted) {
            return (
              <div key={i} className="relative">
                <div
                  className={`relative z-10 flex items-center justify-between p-2.5 rounded-lg border ${
                    isMyVote ? "border-primary" : "border-border"
                  }`}
                >
                  <span className="text-sm font-medium z-10 relative">
                    {isMyVote && "✓ "}{option}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono z-10 relative">
                    {pct}% ({count})
                  </span>
                </div>
                <motion.div
                  className={`absolute inset-0 rounded-lg ${isMyVote ? "bg-primary/15" : "bg-muted/50"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            );
          }

          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={voteMutation.isPending}
              className="w-full p-2.5 rounded-lg border border-border text-left text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              {option}
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <p className="text-[10px] text-muted-foreground mt-2">
          {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
