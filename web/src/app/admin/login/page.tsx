'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.replace("/admin");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-sm p-6">
        <h1 className="font-extrabold text-2xl">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-4">Masuk dengan email & password admin.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded-xl p-3" type="email" placeholder="Email"
                 value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full border rounded-xl p-3" type="password" placeholder="Password"
                 value={pw} onChange={e=>setPw(e.target.value)} required />
          <button disabled={loading} className="w-full rounded-xl p-3 bg-black text-white">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          {msg && <p className="text-red-600 text-sm">{msg}</p>}
        </form>
      </div>
    </main>
  );
}
