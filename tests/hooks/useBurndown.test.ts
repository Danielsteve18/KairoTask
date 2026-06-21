import { describe, it, expect } from "vitest";

// Pure utility functions extracted from useBurndown
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

describe("Burndown utilities", () => {
  it("toDateStr formats correctly", () => {
    const d = new Date(2025, 0, 15);
    expect(toDateStr(d)).toBe("2025-01-15");
  });

  it("eachDay returns all days between start and end inclusive", () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 0, 5);
    const days = eachDay(start, end);
    expect(days).toHaveLength(5);
  });

  it("eachDay returns single day when start === end", () => {
    const d = new Date(2025, 5, 15);
    const days = eachDay(d, d);
    expect(days).toHaveLength(1);
  });

  it("normalizeDate strips time", () => {
    const d = new Date(2025, 5, 15, 10, 30, 0);
    const n = normalizeDate(d);
    expect(n.getHours()).toBe(0);
    expect(n.getMinutes()).toBe(0);
    expect(n.getSeconds()).toBe(0);
  });
});
