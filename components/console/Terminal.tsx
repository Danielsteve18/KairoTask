"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Line {
  id: number;
  text: string;
  type: "input" | "output" | "error" | "system";
}

const BANNER = `  _  __    _          _______        _
 | |/ /   (_)        |__   __|      | |
 | ' /__ _ _ _ __ ___   | | __ _ ___| | __
 |  // _\` | | '__/ _ \\  | |/ _\` / __| |/ /
 | . \\ (_| | | | | (_) | | | (_| \\__ \\   <
 |_|\\_\\__,_|_|_|  \\___/  |_|\\__,_|___/_|\\_\\

 KairoTask Console v0.1`;

const HELP_TEXT = `Comandos disponibles:
  projects   — Listar proyectos
  tasks      — Listar tareas
  stats      — Estadísticas del workspace
  whoami     — Tu perfil
  clear      — Limpiar la terminal
  echo       — Repetir texto
  date       — Fecha y hora actual
  banner     — Mostrar ASCII art
  help       — Mostrar esta ayuda`;

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: "> kairo.console v0.1 — Escribe 'help' para comandos", type: "system" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((text: string, type: Line["type"]) => {
    setLines((prev) => [...prev, { id: nextId, text, type }]);
    setNextId((id) => id + 1);
  }, [nextId]);

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const command = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);
    const supabase = createClient();

    addLine(`$ ${trimmed}`, "input");

    switch (command) {
      case "help":
        addLine(HELP_TEXT, "output");
        break;

      case "clear":
        setLines([]);
        break;

      case "banner":
        addLine(BANNER, "output");
        break;

      case "echo":
        addLine(args.join(" "), "output");
        break;

      case "date":
        addLine(new Date().toLocaleString("es-CO", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        }), "output");
        break;

      case "whoami": {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          addLine("No autenticado. Inicia sesión primero.", "error");
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user.id)
            .single();
          addLine(`  Usuario: ${profile?.full_name ?? "—"}`, "output");
          addLine(`  Email:   ${profile?.email ?? user.email}`, "output");
        }
        setLoading(false);
        break;
      }

      case "projects": {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("name, status, progress")
          .order("created_at");
        if (error) {
          addLine(`Error: ${error.message}`, "error");
        } else if (!data || data.length === 0) {
          addLine("No hay proyectos.", "output");
        } else {
          for (const p of data) {
            const statusDot =
              p.status === "active" ? "🟢" :
              p.status === "review" ? "🟡" :
              p.status === "done" ? "⚪" : "🔵";
            const barLen = Math.round((p.progress ?? 0) / 10);
            const bar = "█".repeat(barLen) + "░".repeat(10 - barLen);
            addLine(`  ${statusDot} ${p.name.padEnd(20)} ${String(p.progress ?? 0).padStart(3)}% ${bar}`, "output");
          }
        }
        setLoading(false);
        break;
      }

      case "tasks": {
        setLoading(true);
        let projectId = args[0];

        if (!projectId) {
          const { data: firstProject } = await supabase
            .from("projects")
            .select("id")
            .limit(1)
            .single();
          if (firstProject) projectId = firstProject.id;
        }

        if (!projectId) {
          addLine("No hay proyectos. Crea uno primero.", "output");
        } else {
          const { data, error } = await supabase
            .from("tasks")
            .select("title, status, priority")
            .eq("project_id", projectId)
            .order("created_at");
          if (error) {
            addLine(`Error: ${error.message}`, "error");
          } else if (!data || data.length === 0) {
            addLine("No hay tareas en este proyecto.", "output");
          } else {
            for (const t of data) {
              const statusIcon =
                t.status === "done" ? "✅" :
                t.status === "in-progress" ? "🔄" :
                t.status === "review" ? "👁" : "📋";
              const priorityTag =
                t.priority === "critical" ? "[CRIT]" :
                t.priority === "high" ? "[HIGH]" :
                t.priority === "medium" ? "[MED]" : "[LOW]";
              addLine(`  ${statusIcon} ${priorityTag} ${t.title}`, "output");
            }
          }
        }
        setLoading(false);
        break;
      }

      case "stats": {
        setLoading(true);
        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });
        const { count: taskCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true });
        const { data: members } = await supabase
          .from("project_members")
          .select("user_id", { count: "exact" });
        const uniqueMembers = new Set(members?.map((m) => m.user_id) ?? []);

        addLine(`  Proyectos:  ${projectCount ?? 0}`, "output");
        addLine(`  Tareas:     ${taskCount ?? 0}`, "output");
        addLine(`  Miembros:   ${uniqueMembers.size}`, "output");
        setLoading(false);
        break;
      }

      case "":
        break;

      default:
        addLine(`Comando no encontrado: ${command}. Escribe 'help' para ver los disponibles.`, "error");
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
  }, [addLine]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1 || historyIdx >= history.length - 1) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        const newIdx = historyIdx + 1;
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="h-full w-full flex flex-col font-mono text-sm p-4 md:p-6 overflow-hidden"
      style={{ background: "#0a0a0b", color: "#22C55E" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output */}
      <div className="flex-1 overflow-y-auto space-y-1 pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#22C55E20 transparent" }}>
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap leading-relaxed">
            <span
              style={{
                color:
                  line.type === "input" ? "#22C55E" :
                  line.type === "error" ? "#EF4444" :
                  line.type === "system" ? "#94A3B8" :
                  "#E2E8F0",
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2" style={{ color: "#22C55E" }}>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Procesando...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 pt-3 border-t shrink-0" style={{ borderColor: "#22C55E20" }}>
        <span style={{ color: "#22C55E", fontWeight: 700 }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-sm"
          style={{ color: "#E2E8F0", caretColor: "#22C55E" }}
          spellCheck={false}
          autoComplete="off"
          placeholder="help"
        />
      </div>
    </div>
  );
}
