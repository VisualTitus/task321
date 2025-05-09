import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializar Supabase con variables de entorno
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewTaskPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    urgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Verificar si el cliente ya existe
      const { data: existingClients, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("email", form.email)
        .single();

      let clientId;

      if (existingClients) {
        clientId = existingClients.id;
      } else {
        const { data: newClient, error: insertError } = await supabase
          .from("clients")
          .insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
          })
          .select()
          .single();

        if (insertError || !newClient) throw insertError;
        clientId = newClient.id;
      }

      // Insertar la nueva tarea
      const { error: taskError } = await supabase.from("task_request").insert({
        client_id: clientId,
        description: form.description,
        urgent: form.urgent,
        status: "pending",
      });

      if (taskError) throw taskError;

      setMessage("✅ Tarea creada correctamente.");
      setForm({
        email: "",
        name: "",
        phone: "",
        address: "",
        description: "",
        urgent: false,
      });
    } catch (error: any) {
      console.error("Error:", error.message || error);
      setMessage("❌ Hubo un error al crear la tarea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📞 Cargar nueva tarea</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required /><br />
        <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required /><br />
        <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Descripción de la tarea" value={form.description} onChange={handleChange} required /><br />
        <label>
          <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} />
          ¿Es urgente?
        </label><br />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Crear tarea"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
