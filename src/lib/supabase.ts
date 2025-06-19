import { createClient } from '@supabase/supabase-js';

// In Vite, environment variables must be prefixed with VITE_
// Support both VITE_PUBLIC_ and VITE_ prefixes
const supabaseUrl: string = 
  import.meta.env.VITE_SUPABASE_URL ?? 
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ?? 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? 
  ''; // No fallback - must be provided via environment variables

const supabaseAnonKey: string = 
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ?? 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 
  ''; // No fallback - must be provided via environment variables

// Debug logging to check if variables are loaded
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Found' : 'Missing');

// Debug: Log all available environment variables starting with VITE
console.log('All VITE env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE')));

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection immediately
(async () => {
  try {
    const { data, error, count } = await supabase.from('credit_cards').select('count', { count: 'exact' });
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful. Card count:', count);
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
})();

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return { error: error.message || 'An unknown error occurred' };
}; 