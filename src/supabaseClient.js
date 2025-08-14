import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', url);
console.log('VITE_SUPABASE_ANON_KEY gesetzt:', !!anon);

function isValidUrl(u){ try { new URL(u); return true; } catch { return false; } }

export const supabase = (url && anon && isValidUrl(url)) ? createClient(url, anon) : null;
