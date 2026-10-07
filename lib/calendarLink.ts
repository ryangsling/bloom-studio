const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DEFAULT_MINUTES = 60;

export interface CalendarEventInput {
  title: string;
  time: string;
  duration: string;
  location: string;
  details: string;
}

/** Parses "2hr 30min", "45min" or "1hr" into minutes; falls back to one hour. */
export function parseDurationMinutes(duration: string): number {
  const hours = Number(/(\d+)\s*h/i.exec(duration)?.[1] ?? 0);
  const minutes = Number(/(\d+)\s*m/i.exec(duration)?.[1] ?? 0);
  return hours * 60 + minutes || DEFAULT_MINUTES;
}

/** Index of the first whole word that abbreviates a weekday ("thu", "Thursday"), or -1. */
function weekdayIndex(text: string): number {
  for (const word of text.toLowerCase().match(/[a-z]+/g) ?? []) {
    const day = WEEKDAYS.findIndex((name) => word.length >= 3 && name.startsWith(word));
    if (day !== -1) return day;
  }
  return -1;
}

/**
 * Resolves free text like "Thursday 2:00pm" or "tomorrow at 4pm" to a date at
 * or after `now`. A weekday that has already passed rolls to next week;
 * "today" and "tomorrow" are taken literally. Returns null when it cannot tell.
 */
export function parseRequestedTime(text: string, now: Date): Date | null {
  const t = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(text);
  if (!t) return null;
  const hour = (Number(t[1]) % 12) + (t[3].toLowerCase() === "pm" ? 12 : 0);

  const date = new Date(now);
  date.setHours(hour, Number(t[2] ?? 0), 0, 0);

  const lower = text.toLowerCase();
  if (lower.includes("tomorrow")) {
    date.setDate(date.getDate() + 1);
    return date;
  }
  if (lower.includes("today")) return date;

  const day = weekdayIndex(text);
  if (day === -1) return null;
  date.setDate(date.getDate() + ((day - now.getDay() + 7) % 7));
  if (date < now) date.setDate(date.getDate() + 7);
  return date;
}

/** Local (floating) time, so the event lands at the same clock time in the viewer's calendar. */
function formatLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}T${p(date.getHours())}${p(date.getMinutes())}00`;
}

/**
 * Google Calendar "add event" link. When the requested time cannot be parsed
 * the link still opens a prefilled event without dates, and the requested
 * wording is kept in the description so the viewer can set the time.
 */
export function googleCalendarUrl(event: CalendarEventInput, now = new Date()): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    location: event.location,
    details: `${event.details}\nRequested time: ${event.time}`,
  });

  const start = parseRequestedTime(event.time, now);
  if (start) {
    const end = new Date(start.getTime() + parseDurationMinutes(event.duration) * 60_000);
    params.set("dates", `${formatLocal(start)}/${formatLocal(end)}`);
  }
  return `https://calendar.google.com/calendar/render?${params}`;
}
