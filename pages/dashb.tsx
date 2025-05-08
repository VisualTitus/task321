

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://quqfgjcuxkbgrjaofyec.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWZnamN1eGtiZ3JqYW9meWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzA2NzEsImV4cCI6MjA2MjIwNjY3MX0.ZOWFNwTc8HUVKcCKg9iIvUzx6KJIWMKC_F5q4uoWVz8");


);

type User = {
  email?: string;
};

export default function DashbPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ email: data.user.email ?? "" });
      }
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📊 Dashboard</h1>
      {user?.email ? (
        <p>Welcome, <strong>{user.email}</strong></p>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
