import { Terminal } from "@/components/console/Terminal";

export default function ConsolePage() {
  return (
    <div className="h-full w-full overflow-hidden border-l"
      style={{ borderColor: "var(--dash-border)" }}>
      <Terminal />
    </div>
  );
}
