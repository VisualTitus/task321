import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-supabase-url.supabase.co' https://quqfgjcuxkbgrjaofyec.supabase.co; // Reemplaza con tu URL de Supabase
const SUPABASE_ANON_KEY = 'your-anon-key'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWZnamN1eGtiZ3JqYW9meWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzA2NzEsImV4cCI6MjA2MjIwNjY3MX0.ZOWFNwTc8HUVKcCKg9iIvUzx6KJIWMKC_F5q4uoWVz8; // Reemplaza con tu clave anónima

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);