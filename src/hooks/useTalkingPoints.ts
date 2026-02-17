import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface TalkingPoint {
  id: string;
  tag_id: string;
  title: string;
  points: string[];
  created_at: string;
}

async function fetchTalkingPoints(): Promise<TalkingPoint[]> {
  const { data, error } = await supabase
    .from("talking_points")
    .select("*")
    .order("tag_id");

  if (error) throw error;
  return (data as TalkingPoint[]) || [];
}

export function useTalkingPoints() {
  return useQuery({
    queryKey: ["talking_points"],
    queryFn: fetchTalkingPoints,
    staleTime: 10 * 60 * 1000,
  });
}
