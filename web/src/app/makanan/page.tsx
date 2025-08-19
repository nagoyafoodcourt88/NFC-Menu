import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function Makanan() {
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id,name,slug,thumb_url,order_index")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md p-4">
        <header className="sticky top-0 bg-white py-3 border-b">
          <Link href="/" className="text-sm text-slate-500 hover:underline">← Kembali</Link>
          <h1 className="font-extrabold text-xl mt-1">Makanan</h1>
        </header>

        <section className="grid grid-cols-1 gap-3 mt-4">
          {!tenants?.length && <div className="text-sm text-slate-500">Belum ada tenant</div>}
          {tenants?.map((t) => (
            <article key={t.id} className="flex items-center gap-3 border rounded-2xl p-3">
              <div className="h-16 w-16 bg-red-600/10 rounded-xl flex items-center justify-center">🍽️</div>
              <div className="flex-1">
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-slate-500">Tap to view items (soon)</div>
              </div>
            </article>
          ))}
        </section>

        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 text-center text-xs text-slate-500">
          &nbsp;
        </footer>
      </div>
    </main>
  );
}
