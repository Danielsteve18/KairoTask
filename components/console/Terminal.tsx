"use client";

import { useState, useRef, useEffect } from "react";
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

let idCounter = 1;

function addLineTo(lines: Line[], text: string, type: Line["type"]) {
  return [...lines, { id: idCounter++, text, type }];
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: "> kairo.console v0.1 — Escribe 'help' para comandos", type: "system" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

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

  function executeCommand(cmd: string) {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const command = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);
    const supabase = createClient();

    setLines((prev) => addLineTo(prev, `$ ${trimmed}`, "input"));

    switch (command) {
      case "help":
        setLines((prev) => addLineTo(prev, HELP_TEXT, "output"));
        break;

      case "clear":
        setLines([]);
        break;

      case "banner":
        setLines((prev) => addLineTo(prev, BANNER, "output"));
        break;

      case "echo":
        setLines((prev) => addLineTo(prev, args.join(" "), "output"));
        break;

      case "date":
        setLines((prev) => addLineTo(prev,
          new Date().toLocaleString("es-CO", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
          }), "output"));
        break;

      case "whoami": {
        setLoading(true);
        supabase.auth.getUser().then(({ data: { user }, error }) => {
          if (error || !user) {
            setLines((prev) => addLineTo(prev, "No autenticado. Inicia sesión primero.", "error"));
          } else {
            supabase.from("profiles")
              .select("full_name, email")
              .eq("id", user.id)
              .single()
              .then(({ data: profile }) => {
                setLines((prev) => {
                  let l = addLineTo(prev, `  Usuario: ${profile?.full_name ?? "—"}`, "output");
                  l = addLineTo(l, `  Email:   ${profile?.email ?? user.email}`, "output");
                  return l;
                });
              });
          }
          setLoading(false);
        });
        break;
      }

      case "projects": {
        setLoading(true);
        supabase.from("projects")
          .select("name, status, progress")
          .order("created_at")
          .then(({ data, error }) => {
            if (error) {
              setLines((prev) => addLineTo(prev, `Error: ${error.message}`, "error"));
            } else if (!data || data.length === 0) {
              setLines((prev) => addLineTo(prev, "No hay proyectos.", "output"));
            } else {
              setLines((prev) => {
                let l = prev;
                for (const p of data) {
                  const statusDot =
                    p.status === "active" ? "🟢" :
                    p.status === "review" ? "🟡" :
                    p.status === "done" ? "⚪" : "🔵";
                  const barLen = Math.round((p.progress ?? 0) / 10);
                  const bar = "█".repeat(barLen) + "░".repeat(10 - barLen);
                  l = addLineTo(l, `  ${statusDot} ${p.name.padEnd(20)} ${String(p.progress ?? 0).padStart(3)}% ${bar}`, "output");
                }
                return l;
              });
            }
            setLoading(false);
          });
        break;
      }

      case "tasks": {
        setLoading(true);
        const targetProjectId = args[0];

        const fetchTasks = (pid: string) => {
          supabase.from("tasks")
            .select("title, status, priority")
            .eq("project_id", pid)
            .order("created_at")
            .then(({ data, error }) => {
              if (error) {
                setLines((prev) => addLineTo(prev, `Error: ${error.message}`, "error"));
              } else if (!data || data.length === 0) {
                setLines((prev) => addLineTo(prev, "No hay tareas en este proyecto.", "output"));
              } else {
                setLines((prev) => {
                  let l = prev;
                  for (const t of data) {
                    const statusIcon =
                      t.status === "done" ? "✅" :
                      t.status === "in-progress" ? "🔄" :
                      t.status === "review" ? "👁" : "📋";
                    const priorityTag =
                      t.priority === "critical" ? "[CRIT]" :
                      t.priority === "high" ? "[HIGH]" :
                      t.priority === "medium" ? "[MED]" : "[LOW]";
                    l = addLineTo(l, `  ${statusIcon} ${priorityTag} ${t.title}`, "output");
                  }
                  return l;
                });
              }
              setLoading(false);
            });
        };

        if (targetProjectId) {
          fetchTasks(targetProjectId);
        } else {
          supabase.from("projects")
            .select("id")
            .limit(1)
            .single()
            .then(({ data: firstProject }) => {
              if (firstProject) {
                fetchTasks(firstProject.id);
              } else {
                setLines((prev) => addLineTo(prev, "No hay proyectos. Crea uno primero.", "output"));
                setLoading(false);
              }
            });
        }
        break;
      }

      case "stats": {
        setLoading(true);
        Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("tasks").select("*", { count: "exact", head: true }),
          supabase.from("project_members").select("user_id", { count: "exact" }),
        ]).then(([projectsRes, tasksRes, membersRes]) => {
          const uniqueMembers = new Set(membersRes.data?.map((m) => m.user_id) ?? []);
          setLines((prev) => {
            let l = addLineTo(prev, `  Proyectos:  ${projectsRes.count ?? 0}`, "output");
            l = addLineTo(l, `  Tareas:     ${tasksRes.count ?? 0}`, "output");
            l = addLineTo(l, `  Miembros:   ${uniqueMembers.size}`, "output");
            return l;
          });
          setLoading(false);
        });
        break;
      }

      case "":
        break;

      default:
        setLines((prev) => addLineTo(prev, `Comando no encontrado: ${command}. Escribe 'help' para ver los disponibles.`, "error"));
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
  }

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
