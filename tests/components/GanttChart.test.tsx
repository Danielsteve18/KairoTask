import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GanttChart } from "@/components/project/GanttChart";

vi.mock("@/hooks/useSprints", () => ({
  useSprints: () => ({ sprints: [], isLoading: false }),
}));

vi.mock("@/hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [
      { id: "1", title: "Task A", due_date: new Date(Date.now() + 864e5).toISOString(), status: "in-progress", priority: "high", created_at: new Date().toISOString(), project_id: "p1" },
    ],
    isLoading: false,
  }),
}));

describe("GanttChart", () => {
  it("renders task names", () => {
    render(<GanttChart projectId="p1" />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
  });

  it("renders timeline header", () => {
    render(<GanttChart projectId="p1" />);
    expect(screen.getByText("Tarea")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });
});
