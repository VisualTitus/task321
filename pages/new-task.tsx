import { useState, FormEvent, ChangeEvent } from "react";
import { createClient, PostgrestError } from "@supabase/supabase-js";

// Initialize Supabase with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FormState = {
  email: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  urgent: boolean;
};

export default function NewTaskPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    urgent: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget;
    const { name, type, value } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Check if client already exists by email
      const {
        data: existingClient,
        error: existingClientError,
      } = await supabase
        .from("clients")
        .select("id")
        .eq("email", form.email)
        .single();

      if (existingClientError && !(existingClientError instanceof PostgrestError)) {
        throw existingClientError;
      }

      let clientId: number;
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const {
          data: newClient,
          error: insertError,
        } = await supabase
          .from("clients")
          .insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        clientId = newClient!.id;
      }

      // Insert the new task request
      const { error: taskError } = await supabase
        .from("task_request")
        .insert({
          client_id: clientId,
          description: form.description,
          urgent: form.urgent,
          status: "pending",
        });
      if (taskError) throw taskError;

      setMessage("✅ Task created successfully.");
      setForm({
        email: "",
        name: "",
        phone: "",
        address: "",
        description: "",
        urgent: false,
      });
    } catch (err) {
  console.error("Full error object:", err);
  // If Supabase returns an object, stringify it:
  const errorText =
    err instanceof Error
      ? err.message
      : typeof err === "object"
      ? JSON.stringify(err, null, 2)
      : String(err);
  setMessage(`❌ Error: ${errorText}`);
}
    
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📞 Create New Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <label>
          <input
            type="checkbox"
            name="urgent"
            checked={form.urgent}
            onChange={handleChange}
          />
          Urgent?
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Task"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
