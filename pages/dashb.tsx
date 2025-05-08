import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Reemplazá con tus datos reales
const supabase = createClient("https://quqfgjcuxkbgrjaofyec.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWZnamN1eGtiZ3JqYW9meWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzA2NzEsImV4cCI6MjA2MjIwNjY3MX0.ZOWFNwTc8HUVKcCKg9iIvUzx6KJIWMKC_F5q4uoWVz8");

type Role = "manager" | "tecnico" | "callcenter";

export default function DashbPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !data) {
        console.error("Error loading profile:", profileError);
        return;
      }

      setRole(data.role);
      setLoading(false);
    };

    fetchRole();
  }, [router]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📊 Dashboard</h1>
      <p>Rol: <strong>{role}</strong></p>

      {role === "manager" && (
        <ul>
          <li>📈 Ver estadísticas</li>
          <li>👥 Gestión de usuarios</li>
          <li>🗃️ Todas las órdenes</li>
        </ul>
      )}

      {role === "callcenter" && (
        <ul>
          <li>📞 Cargar nueva tarea</li>
          <li>📂 Ver tareas en espera</li>
        </ul>
      )}

      {role === "tecnico" && (
        <ul>
          <li>🔧 Ver mis órdenes asignadas</li>
          <li>✅ Marcar orden como finalizada</li>
        </ul>
      )}
    </div>
  );
}
