import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let supabaseBrowserClient: ReturnType<
  typeof createBrowserClient<Database>
> | null = null;

export function createSupabaseBrowserClient() {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.",
    );
  }

  supabaseBrowserClient = createBrowserClient<Database>(
    url,
    anonKey,
  );

  return supabaseBrowserClient;
}