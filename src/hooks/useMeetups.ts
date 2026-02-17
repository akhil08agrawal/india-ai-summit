import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";

export interface Meetup {
  id: string;
  device_id: string;
  title: string;
  location: string;
  time: string;
  description: string | null;
  persona_tag: string | null;
  max_attendees: number;
  created_at: string;
  rsvp_count: number;
  has_rsvped: boolean;
}

export interface MeetupFilters {
  timeFilter?: "all" | "1hr" | "2hr" | "my_rsvps";
}

async function fetchMeetups(filters: MeetupFilters): Promise<Meetup[]> {
  const deviceId = getDeviceId();

  let query = supabase
    .from("meetups")
    .select("*")
    .order("time", { ascending: true });

  // Only show future meetups (or ones in the last 30 min)
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  query = query.gte("time", cutoff);

  const { data: meetups, error } = await query;
  if (error) throw error;
  if (!meetups || meetups.length === 0) return [];

  const meetupIds = meetups.map((m: any) => m.id);

  // Fetch RSVPs
  const { data: rsvps } = await supabase
    .from("meetup_rsvps")
    .select("meetup_id, device_id")
    .in("meetup_id", meetupIds);

  const allRsvps = rsvps || [];

  let result: Meetup[] = meetups.map((m: any) => {
    const meetupRsvps = allRsvps.filter((r: any) => r.meetup_id === m.id);
    return {
      ...m,
      rsvp_count: meetupRsvps.length,
      has_rsvped: meetupRsvps.some((r: any) => r.device_id === deviceId),
    };
  });

  // Apply time filter
  const now = Date.now();
  if (filters.timeFilter === "1hr") {
    result = result.filter((m) => new Date(m.time).getTime() - now <= 3600_000);
  } else if (filters.timeFilter === "2hr") {
    result = result.filter((m) => new Date(m.time).getTime() - now <= 7200_000);
  } else if (filters.timeFilter === "my_rsvps") {
    result = result.filter((m) => m.has_rsvped || m.device_id === deviceId);
  }

  return result;
}

export function useMeetups(filters: MeetupFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["meetups", filters],
    queryFn: () => fetchMeetups(filters),
    staleTime: 15_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("meetup-rsvps-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetup_rsvps" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["meetups"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useCreateMeetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meetup: {
      title: string;
      location: string;
      time: string;
      description?: string;
      persona_tag?: string;
      max_attendees?: number;
    }) => {
      const deviceId = getDeviceId();
      const { error } = await supabase.from("meetups").insert({
        ...meetup,
        device_id: deviceId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    },
  });
}

export function useToggleRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meetupId, hasRsvped }: { meetupId: string; hasRsvped: boolean }) => {
      const deviceId = getDeviceId();
      if (hasRsvped) {
        const { error } = await supabase
          .from("meetup_rsvps")
          .delete()
          .eq("meetup_id", meetupId)
          .eq("device_id", deviceId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("meetup_rsvps")
          .insert({ meetup_id: meetupId, device_id: deviceId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    },
  });
}

export function useDeleteMeetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meetupId: string) => {
      const { error } = await supabase.from("meetups").delete().eq("id", meetupId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    },
  });
}
