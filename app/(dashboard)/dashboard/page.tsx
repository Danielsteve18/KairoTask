import { redirect } from "next/navigation";

// /dashboard redirige directamente a /projects (vista principal de la app)
export default function DashboardPage() {
  redirect("/projects");
}
