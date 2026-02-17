import { useState } from "react";
import { useMeetups, useToggleRsvp, useDeleteMeetup, MeetupFilters } from "@/hooks/useMeetups";
import { getDeviceId } from "@/lib/device-id";
import { formatDistanceToNow, format } from "date-fns";
import { MapPin, Clock, Users, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import CreateMeetupDialog from "@/components/CreateMeetupDialog";

const FILTERS: { id: MeetupFilters["timeFilter"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "1hr", label: "Next 1hr" },
  { id: "2hr", label: "Next 2hr" },
  { id: "my_rsvps", label: "My RSVPs" },
];

export default function MeetupsTab() {
  const [timeFilter, setTimeFilter] = useState<MeetupFilters["timeFilter"]>("all");
  const [showCreate, setShowCreate] = useState(false);
  const { data: meetups, isLoading } = useMeetups({ timeFilter });
  const toggleRsvp = useToggleRsvp();
  const deleteMeetup = useDeleteMeetup();
  const deviceId = getDeviceId();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">🤝 Meetups</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTimeFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeFilter === f.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground text-center py-8">Loading meetups...</div>
      )}

      {!isLoading && (!meetups || meetups.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No meetups yet. Be the first to create one!</p>
        </div>
      )}

      <div className="space-y-3">
        {meetups?.map((meetup, i) => {
          const isCreator = meetup.device_id === deviceId;
          const isFull = meetup.rsvp_count >= meetup.max_attendees;
          const meetupTime = new Date(meetup.time);
          const isPast = meetupTime.getTime() < Date.now();

          return (
            <motion.div
              key={meetup.id}
              className={`p-4 rounded-xl bg-card border border-border ${isPast ? "opacity-60" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-sm">{meetup.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {meetup.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {format(meetupTime, "h:mm a")} · {formatDistanceToNow(meetupTime, { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {meetup.rsvp_count}/{meetup.max_attendees}
                    </span>
                  </div>
                  {meetup.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{meetup.description}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {isCreator && (
                    <button
                      onClick={() => deleteMeetup.mutate(meetup.id)}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors"
                      title="Delete meetup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {!isCreator && !isPast && (
                    <button
                      onClick={() =>
                        toggleRsvp.mutate({ meetupId: meetup.id, hasRsvped: meetup.has_rsvped })
                      }
                      disabled={(!meetup.has_rsvped && isFull) || toggleRsvp.isPending}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        meetup.has_rsvped
                          ? "bg-primary/10 text-primary border border-primary"
                          : isFull
                            ? "bg-muted text-muted-foreground border border-border"
                            : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {meetup.has_rsvped ? "Cancel" : isFull ? "Full" : "RSVP"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CreateMeetupDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
