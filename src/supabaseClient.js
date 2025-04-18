import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxgnialrwuvvmhntlkdh.supabase.co'; // replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z25pYWxyd3V2dm1obnRsa2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODEzNzQsImV4cCI6MjA2MDU1NzM3NH0.lfAx3ZzD8OLblUsXMHdB5ZchjmFAHs4jhzKdpz3eNHM'; // replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey);