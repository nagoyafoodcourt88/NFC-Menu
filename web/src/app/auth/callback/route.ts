import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';

/* Payload that our login page posts */
type SupabaseEvent = 'SIGNED_IN' | 'TOKEN_REFRESHED' | 'SIGNED_OUT';
type CallbackPayload = { event: SupabaseEvent; session: Session | null };

/* Cookie option shape used by the SSR adapter */
type CookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
};

export async function POST(req: Request) {
  const { event, session } = (await req.json()) as CallbackPayload;

  const store = cookies();

  // Adapter that matches the API `@supabase/ssr` expects
  const cookieAdapter = {
    get(name: string): string | undefined {
      return store.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions): void {
      store.set({ name, value, ...options });
    },
    remove(name: string, options: CookieOptions): void {
      store.set({ name, value: '', ...options, expires: new Date(0) });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
    await supabase.auth.setSession(session);
  } else if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
