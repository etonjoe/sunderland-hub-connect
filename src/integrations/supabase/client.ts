
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gpbwlvooyvqsjuytykgo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYndsdm9veXZxc2p1eXR5a2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MzMwOTUsImV4cCI6MjA2MDUwOTA5NX0.aMhpjRQHqQ79YaKPXWFgxrxKOrogje8i35jL6mf01OQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
