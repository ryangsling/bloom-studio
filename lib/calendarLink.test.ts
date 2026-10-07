import { describe, expect, it } from "vitest";
import { googleCalendarUrl, parseDurationMinutes, parseRequestedTime } from "@/lib/calendarLink";

// Wednesday 7 Oct 2026, 10:00 local
const NOW = new Date(2026, 9, 7, 10, 0);

describe("parseDurationMinutes", () => {
  it("parses hours and minutes", () => {
    expect(parseDurationMinutes("2hr 30min")).toBe(150);
    expect(parseDurationMinutes("45min")).toBe(45);
  });
  it("falls back to one hour", () => {
    expect(parseDurationMinutes("varies")).toBe(60);
  });
});

describe("parseRequestedTime", () => {
  it("finds the next matching weekday", () => {
    const d = parseRequestedTime("Thursday at 2:00 pm", NOW)!;
    expect([d.getDate(), d.getHours(), d.getMinutes()]).toEqual([8, 14, 0]);
  });
  it("rolls a passed time on the same weekday to next week", () => {
    expect(parseRequestedTime("Wed 9am", NOW)!.getDate()).toBe(14);
  });
  it("handles today and tomorrow", () => {
    expect(parseRequestedTime("today 4:30pm", NOW)!.getDate()).toBe(7);
    expect(parseRequestedTime("tomorrow 4pm", NOW)!.getDate()).toBe(8);
  });
  it("returns null without a time or a day", () => {
    expect(parseRequestedTime("sometime soon", NOW)).toBeNull();
    expect(parseRequestedTime("2pm", NOW)).toBeNull();
  });
});

describe("googleCalendarUrl", () => {
  const event = {
    title: "Balayage at Bloom Studio",
    time: "Thu 2:00pm",
    duration: "2hr 30min",
    location: "42 Vyse Street",
    details: "Requested",
  };

  it("builds a Google Calendar template link with start and end", () => {
    const url = new URL(googleCalendarUrl(event, NOW)!);
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe("20261008T140000/20261008T163000");
    expect(url.searchParams.get("text")).toBe(event.title);
  });

  it("returns null when the time cannot be understood", () => {
    expect(googleCalendarUrl({ ...event, time: "whenever" }, NOW)).toBeNull();
  });
});
