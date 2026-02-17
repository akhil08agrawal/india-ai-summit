import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMeetup } from "@/hooks/useMeetups";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { addMinutes, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const VENUE_SUGGESTIONS = [
  "Hall 1 Lobby",
  "Hall 2 Entrance",
  "Food Court Area",
  "Main Stage Foyer",
  "Startup Pavilion",
  "Networking Lounge",
  "Outside Gate 1",
  "Convention Centre Café",
];

const QUICK_TIMES = [
  { label: "In 15 min", minutes: 15 },
  { label: "In 30 min", minutes: 30 },
  { label: "In 1 hour", minutes: 60 },
];

const meetupSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  location: z.string().min(2, "Location is required").max(100),
  time: z.string().min(1, "Time is required"),
  description: z.string().max(300).optional(),
  max_attendees: z.number().min(2).max(100).optional(),
});

type MeetupFormData = z.infer<typeof meetupSchema>;

interface CreateMeetupDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMeetupDialog({ open, onClose }: CreateMeetupDialogProps) {
  const isMobile = useIsMobile();
  const createMeetup = useCreateMeetup();

  const content = <MeetupForm onClose={onClose} createMeetup={createMeetup} />;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create Meetup</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Meetup</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function MeetupForm({
  onClose,
  createMeetup,
}: {
  onClose: () => void;
  createMeetup: ReturnType<typeof useCreateMeetup>;
}) {
  const [showCustomTime, setShowCustomTime] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MeetupFormData>({
    resolver: zodResolver(meetupSchema),
    defaultValues: { max_attendees: 10 },
  });

  const currentTime = watch("time");

  const onSubmit = async (data: MeetupFormData) => {
    try {
      await createMeetup.mutateAsync({
        title: data.title,
        location: data.location,
        time: data.time,
        description: data.description,
        max_attendees: data.max_attendees,
      });
      onClose();
    } catch (err) {
      console.error("Failed to create meetup:", err);
    }
  };

  const setQuickTime = (minutes: number) => {
    const time = addMinutes(new Date(), minutes);
    setValue("time", time.toISOString());
    setShowCustomTime(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-sm font-medium block mb-1">Title</label>
        <input
          {...register("title")}
          placeholder="e.g. Coffee chat about AI safety"
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium block mb-1">Location</label>
        <input
          {...register("location")}
          placeholder="Where at the venue?"
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {VENUE_SUGGESTIONS.slice(0, 4).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setValue("location", loc)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
        {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="text-sm font-medium block mb-1">When</label>
        <div className="flex gap-2 mb-2">
          {QUICK_TIMES.map((qt) => (
            <button
              key={qt.minutes}
              type="button"
              onClick={() => setQuickTime(qt.minutes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                !showCustomTime && currentTime
                  ? "border-border text-muted-foreground hover:border-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {qt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCustomTime(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:border-primary transition-all"
          >
            Custom
          </button>
        </div>
        {showCustomTime && (
          <input
            type="datetime-local"
            onChange={(e) => setValue("time", new Date(e.target.value).toISOString())}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        )}
        {currentTime && !showCustomTime && (
          <p className="text-xs text-primary">
            Set for {format(new Date(currentTime), "h:mm a, MMM d")}
          </p>
        )}
        {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium block mb-1">Description (optional)</label>
        <textarea
          {...register("description")}
          placeholder="What's this about?"
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Max attendees */}
      <div>
        <label className="text-sm font-medium block mb-1">Max attendees</label>
        <input
          type="number"
          {...register("max_attendees", { valueAsNumber: true })}
          min={2}
          max={100}
          className="w-20 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <button
        type="submit"
        disabled={createMeetup.isPending}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm disabled:opacity-50 transition-colors"
      >
        {createMeetup.isPending ? "Creating..." : "Create Meetup"}
      </button>
    </form>
  );
}
