import { useState, useEffect, useMemo } from "react";
import { parse, isAfter, differenceInSeconds } from "date-fns";
import { days, getScheduleForDay } from "@/data/summit";

interface CountdownState {
  label: string | null;
  timeLeft: string | null;
  nextSession: any | null;
}

const VAGUE_TIMES = ["all day", "during day", "full day", "evening", "tbd"];

function parseSessionTime(timeStr: string, dateStr: string): Date | null {
  const lower = timeStr.toLowerCase();
  if (VAGUE_TIMES.some((v) => lower.includes(v))) return null;

  // Extract start time: "9:30 AM+", "9:30-10:25 AM", "3:00-5:00 PM"
  const match = timeStr.match(/^(\d{1,2}:\d{2})\s*(AM|PM)/i)
    || timeStr.match(/^(\d{1,2}:\d{2})-\d{1,2}:\d{2}\s*(AM|PM)/i);
  if (!match) return null;

  const timeOnly = `${match[1]} ${match[2].toUpperCase()}`;
  try {
    return parse(`${dateStr} ${timeOnly}`, "yyyy-MM-dd h:mm a", new Date());
  } catch {
    return null;
  }
}

function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return "now";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function useCountdown(): CountdownState {
  const allSessions = useMemo(() => {
    const sessions: { session: string; time: string; date: string; parsedTime: Date }[] = [];
    for (const day of days) {
      const daySessions = getScheduleForDay(day.id);
      for (const s of daySessions) {
        const parsed = parseSessionTime(s.time, day.date);
        if (parsed) {
          sessions.push({ session: s.session, time: s.time, date: day.date, parsedTime: parsed });
        }
      }
    }
    return sessions.sort((a, b) => a.parsedTime.getTime() - b.parsedTime.getTime());
  }, []);

  const [state, setState] = useState<CountdownState>({ label: null, timeLeft: null, nextSession: null });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = allSessions.find((s) => isAfter(s.parsedTime, now));
      if (!next) {
        setState({ label: null, timeLeft: null, nextSession: null });
        return;
      }
      const diff = differenceInSeconds(next.parsedTime, now);
      setState({
        label: next.session,
        timeLeft: formatTimeLeft(diff),
        nextSession: next,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [allSessions]);

  return state;
}
