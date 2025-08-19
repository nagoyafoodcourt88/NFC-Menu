import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id,name,slug,order_index')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md p-4">
        <header className="sticky top-0 bg-white py-3 border-b">
          <h1 className="font-extrabold text-xl">NFC Menu</h1>
          <p className="text-sm text-slate-500">Makanan / Minuman (minuman: coming soon)</p>
        </header>

        <section className="grid grid-cols-1 gap-3 mt-4">
          {!tenants?.length && <div className="text-sm text-slate-500">No tenants yet</div>}
          {tenants?.map(t => (
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
          © {new Date().getFullYear()} Nagoya Foodcourt • One QR for all
        </footer>
      </div>
    </main>
  );
}
