import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalendarView } from "@/components/project/CalendarView";

vi.mock("@/hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [
      { id: "1", title: "Test task", due_date: new Date().toISOString(), status: "in-progress", priority: "high", created_at: new Date().toISOString(), project_id: "p1" },
    ],
    isLoading: false,
  }),
}));

describe("CalendarView", () => {
  it("renders month header", () => {
    render(<CalendarView projectId="p1" />);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const currentMonth = months[new Date().getMonth()];
    expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
  });

  it("renders day headers", () => {
    render(<CalendarView projectId="p1" />);
    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByText("Lun")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });
});
