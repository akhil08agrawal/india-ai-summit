import { days } from "@/data/summit";
import type { BookmarkEntry } from "@/contexts/BookmarksContext";

function getDateForDay(dayId: number): string | null {
  const day = days.find(d => d.id === dayId);
  return day?.date || null;
}

function parseTime(timeStr: string, dateStr: string): { start: Date; end: Date } | null {
  // Handle formats: "9:30-10:25 AM", "~5:00 PM", "All day", "Evening", "During day", "Full day", "Morning", "9:30 AM+"
  const lower = timeStr.toLowerCase().trim();

  if (["all day", "during day", "full day"].includes(lower)) {
    const start = new Date(`${dateStr}T09:30:00+05:30`);
    const end = new Date(`${dateStr}T18:00:00+05:30`);
    return { start, end };
  }

  if (lower === "evening") {
    const start = new Date(`${dateStr}T17:00:00+05:30`);
    const end = new Date(`${dateStr}T21:00:00+05:30`);
    return { start, end };
  }

  if (lower === "morning") {
    const start = new Date(`${dateStr}T09:00:00+05:30`);
    const end = new Date(`${dateStr}T12:00:00+05:30`);
    return { start, end };
  }

  // "~5:00 PM" or "9:30 AM+"
  const singleMatch = timeStr.match(/~?(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (singleMatch && !timeStr.includes("-")) {
    const hours = convertTo24(parseInt(singleMatch[1]), parseInt(singleMatch[2]), singleMatch[3].toUpperCase());
    const start = new Date(`${dateStr}T${pad(hours.h)}:${pad(hours.m)}:00+05:30`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
    return { start, end };
  }

  // "9:30-10:25 AM" or "2:30-3:30 PM" or "10:30-11:25 AM"
  const rangeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (rangeMatch) {
    const period = rangeMatch[5].toUpperCase();
    const startH = convertTo24(parseInt(rangeMatch[1]), parseInt(rangeMatch[2]), period);
    const endH = convertTo24(parseInt(rangeMatch[3]), parseInt(rangeMatch[4]), period);
    const start = new Date(`${dateStr}T${pad(startH.h)}:${pad(startH.m)}:00+05:30`);
    const end = new Date(`${dateStr}T${pad(endH.h)}:${pad(endH.m)}:00+05:30`);
    return { start, end };
  }

  // Fallback
  const start = new Date(`${dateStr}T10:00:00+05:30`);
  const end = new Date(`${dateStr}T11:00:00+05:30`);
  return { start, end };
}

function convertTo24(h: number, m: number, period: string): { h: number; m: number } {
  if (period === "AM") {
    return { h: h === 12 ? 0 : h, m };
  }
  return { h: h === 12 ? 12 : h + 12, m };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeICS(str: string): string {
  return str.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

function generateICSContent(events: BookmarkEntry[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//India AI Summit 2026//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const event of events) {
    const dateStr = getDateForDay(event.dayId);
    if (!dateStr) continue;

    const times = parseTime(event.time, dateStr);
    if (!times) continue;

    lines.push("BEGIN:VEVENT");
    lines.push(`DTSTART:${formatICSDate(times.start)}`);
    lines.push(`DTEND:${formatICSDate(times.end)}`);
    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    if (event.venue) lines.push(`LOCATION:${escapeICS(event.venue)}`);
    if (event.speakers) lines.push(`DESCRIPTION:${escapeICS(event.speakers)}`);
    lines.push(`UID:${event.dayId}-${encodeURIComponent(event.title)}@indiaaisummit`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(events: BookmarkEntry[], filename = "india-ai-summit.ics") {
  const content = generateICSContent(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleICS(event: BookmarkEntry) {
  const safeName = event.title.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 40);
  downloadICS([event], `${safeName}.ics`);
}
