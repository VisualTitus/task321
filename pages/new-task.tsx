import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NewTaskPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    urgent: false,
  });
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
    setMessage("");

    let clientId: number | null = null;

    if (form.email) {
      const { data: existingClient, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("email", form.email)
        .maybeSingle();

      if (clientError) {
        setMessage("❌ Error al verificar cliente existente");
        return;
      }

      if (existingClient) {
        clientId = existingClient.id;
      }
    }

    if (!clientId) {
      const { data: newClient, error: newClientError } = await supabase
        .from("clients")
        .insert([{ email: form.email || null, name: form.name, phone: form.phone, address: form.address }])
        .select()
        .single();

      if (newClientError) {
        setMessage("❌ Error al guardar cliente");
        return;
      }

      clientId = newClient?.id ?? null;
    }

    if (!clientId) {
      setMessage("❌ No se pudo obtener el ID del cliente");
      return;
    }

    const { error: taskError } = await supabase
      .from("task_request")
      .insert([{ client_id: clientId, description: form.description, urgent: form.urgent }]);

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
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>📞 Nueva Orden</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required />
        <label>
          <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} />
          Urgente
        </label>
        <br />
        <button type="submit">Guardar</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
