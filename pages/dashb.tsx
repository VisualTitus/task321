import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://YOUR_PROJECT.supabase.co",
  "YOUR_ANON_KEY"
);

export default function DashbPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📊 Dashboard</h1>
      {email ? (
        <p>Welcome, <strong>{email}</strong></p>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
