import { useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { ChevronDown, ChevronUp, Pin, Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AnnouncementsBanner() {
  const { data: announcements } = useAnnouncements();
  const [expanded, setExpanded] = useState(true);

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-heading font-bold text-foreground mb-2"
      >
        <Megaphone className="w-4 h-4 text-primary" />
        Announcements ({announcements.length})
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="space-y-2">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`p-3 rounded-xl bg-card border border-border ${
                a.priority === "urgent" ? "border-l-4 border-l-[#FF6B35]" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                {a.is_pinned && <Pin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-heading font-bold">{a.title}</h4>
                  {a.body && <p className="text-xs text-muted-foreground mt-0.5">{a.body}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
