import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  is_active: boolean;
  created_at: string;
}

export interface PollWithResults extends Poll {
  votes: number[];
  totalVotes: number;
  myVote: number | null;
}

async function fetchActivePolls(): Promise<PollWithResults[]> {
  const deviceId = getDeviceId();

  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (pollsError) throw pollsError;
  if (!polls || polls.length === 0) return [];

  const pollIds = polls.map((p: any) => p.id);

  // Fetch all votes for these polls
  const { data: allVotes } = await supabase
    .from("poll_votes")
    .select("poll_id, option_index, device_id")
    .in("poll_id", pollIds);

  const votes = allVotes || [];

  return polls.map((poll: any) => {
    const pollVotes = votes.filter((v: any) => v.poll_id === poll.id);
    const options = poll.options as string[];
    const voteCounts = options.map(
      (_: string, i: number) => pollVotes.filter((v: any) => v.option_index === i).length
    );
    const myVoteRecord = pollVotes.find((v: any) => v.device_id === deviceId);

    return {
      ...poll,
      options,
      votes: voteCounts,
      totalVotes: pollVotes.length,
      myVote: myVoteRecord ? myVoteRecord.option_index : null,
    };
  });
}

export function useActivePolls() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["polls"],
    queryFn: fetchActivePolls,
    staleTime: 10_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("poll-votes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "poll_votes" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["polls"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
      const deviceId = getDeviceId();
      const { error } = await supabase
        .from("poll_votes")
        .insert({ poll_id: pollId, device_id: deviceId, option_index: optionIndex });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint — already voted
          throw new Error("Already voted");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
}
