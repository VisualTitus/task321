import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://quqfgjcuxkbgrjaofyec.supabase.co", "eyJhbGciOiJI...");

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

    let clientId = null;

    if (form.email) {
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("email", form.email)
        .maybeSingle();

      if (existingClient) clientId = existingClient.id;
    }

    if (!clientId) {
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert([{ email: form.email || null, name: form.name, phone: form.phone, address: form.address }])
        .select()
        .single();

      if (clientError || !newClient) {
        setMessage("❌ Error al guardar cliente");
        setLoading(false);
        return;
      }

      clientId = newClient.id;
    }

    const { error: taskError } = await supabase.from("task_request").insert([
      {
        client_id: clientId,
        description: form.description,
        urgent: form.urgent,
      },
    ]);

    if (taskError) {
      setMessage("❌ Error al crear orden");
    } else {
      setMessage("✅ Orden creada correctamente");
      setForm({
        email: "",
        name: "",
        phone: "",
        address: "",
        description: "",
        urgent: false,
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>📞 Nueva Orden de Trabajo</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
        <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} />
        <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
        <textarea name="description" placeholder="Descripción del problema" value={form.description} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} />
          Es urgente
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear orden"}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}
