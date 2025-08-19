import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Lightbox from "@/components/Lightbox";

export const revalidate = 60; // ISR

type Row = {
  id: string;
  name: string;
  slug: string;
  thumb_url: string | null;
  items: {
    id: string;
    name_id: string;
    name_en: string;
    price: number;
    image_url: string | null;
    description: string | null;  // ensure this column exists (text)
    is_active: boolean;
  }[] | null;
};

function rp(n: number) {
  return 'Rp ' + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default async function TenantPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data, error } = await supabase
    .from("tenants")
    .select(`
      id, name, slug, thumb_url,
      items:menu_items ( id, name_id, name_en, price, image_url, description, is_active )
    `)
    .eq("slug", slug)
    .single<Row>();

  if (error || !data) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-md p-4">
          <Link href="/makanan" className="text-sm text-slate-500 hover:underline">← Kembali</Link>
          <h1 className="font-extrabold text-xl mt-2">Tenant tidak ditemukan</h1>
        </div>
      </main>
    );
  }

  const activeItems = (data.items ?? []).filter(i => i.is_active);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md p-4">
        <header className="sticky top-0 bg-white py-3 border-b">
          <Link href="/makanan" className="text-sm text-slate-500 hover:underline">← Kembali</Link>
          <h1 className="font-extrabold text-2xl mt-1">{data.name}</h1>
        </header>

        <section className="mt-4 grid gap-3">
          {activeItems.length === 0 && (
            <div className="text-sm text-slate-500">Belum ada menu.</div>
          )}

          {activeItems.map((it) => (
            <article key={it.id} className="flex gap-3 border rounded-2xl p-3">
              <Lightbox src={it.image_url ?? ""} alt={it.name_id} />
              <div className="flex-1">
                <div className="font-semibold">{it.name_id}</div>
                <div className="text-xs text-slate-500">{it.name_en}</div>
                {it.description && (
                  <p className="mt-1 text-sm text-slate-700">{it.description}</p>
                )}
                <div className="mt-1 font-bold text-red-700">{rp(it.price)}</div>
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
