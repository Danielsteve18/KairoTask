"use client";

import { type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "var(--dash-border)" }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-6 space-y-4"
      style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div
        className="grid grid-cols-[1fr_120px_120px_100px_40px] items-center px-4 py-2 rounded-lg"
        style={{ background: "var(--dash-surface)" }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: i === 0 ? "60%" : "70%" }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_120px_120px_100px_40px] items-center px-4 py-3 rounded-xl border"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton
              key={j}
              className="h-4"
              style={{ width: j === 0 ? "70%" : j === 4 ? "40%" : "60%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-5 h-full overflow-x-auto pb-4 pr-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl border w-[300px] shrink-0"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--dash-border)" }}>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="p-3 space-y-3 flex-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="rounded-xl border p-4 space-y-3"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
