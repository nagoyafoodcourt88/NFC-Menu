import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

type SupabaseEvent = 'SIGNED_IN' | 'TOKEN_REFRESHED' | 'SIGNED_OUT';
type CallbackPayload = { event: SupabaseEvent; session: unknown };

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

  const cookieStore = cookies();

  // Implement the cookie adapter without `any`
  const cookieAdapter = {
    get: (name: string): string | undefined => cookieStore.get(name)?.value,
    set: (name: string, value: string, options: CookieOptions): void => {
      cookieStore.set({ name, value, ...options });
    },
    remove: (name: string, options: CookieOptions): void => {
      cookieStore.set({ name, value: '', ...options, expires: new Date(0) });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );

  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    await supabase.auth.setSession(session as any); // Supabase accepts the raw session shape
  } else if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
