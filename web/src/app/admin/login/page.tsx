'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }

    // session is stored in local storage by supabase-js
    router.replace('/admin');
  }

  return (
    <main className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 p-6 rounded-xl border">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button disabled={busy} className="w-full bg-black text-white rounded-xl p-3">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {msg && <p className="text-red-600 text-sm">{msg}</p>}
      </form>
    </main>
  );
}
