import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import TenantSearch, { Tenant, Item } from "@/components/TenantSearch";

export const revalidate = 60; // ISR

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  thumb_url: string | null;
  order_index: number | null;
  is_active: boolean;
  items: Array<{
    id: string;
    name_id: string;
    name_en: string;
    price: number;
    image_url: string | null;
    is_active: boolean;
  }> | null;
};

export default async function Makanan() {
  const { data, error } = await supabase
    .from("tenants")
    .select(`
      id, name, slug, thumb_url, order_index, is_active,
      items:menu_items ( id, name_id, name_en, price, image_url, is_active )
    `)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(error);
  }

  const tenants: Tenant[] = (data as TenantRow[] | null)?.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    thumb_url: t.thumb_url,
    order_index: t.order_index ?? 0,
    items: (t.items ?? [])
      .filter((it) => it.is_active)
      .map<Item>((it) => ({
        id: it.id,
        name_id: it.name_id,
        name_en: it.name_en,
        price: it.price,
        image_url: it.image_url,
      })),
  })) ?? [];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 bg-white py-3 border-b">
        <div className="mx-auto max-w-md px-4">
          <Link href="/" className="text-sm text-slate-500 hover:underline">← Kembali</Link>
          <h1 className="font-extrabold text-2xl mt-1">Makanan</h1>
        </div>
      </header>

      <TenantSearch initialTenants={tenants} />

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 text-center text-xs text-slate-500">
        &nbsp;
      </footer>
    </main>
  );
}
