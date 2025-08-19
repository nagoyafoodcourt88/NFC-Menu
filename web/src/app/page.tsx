import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md p-4">
        <header className="sticky top-0 bg-white py-3 border-b">
          <h1 className="font-extrabold text-xl">NFC Menu</h1>
          <p className="text-sm text-slate-500">Silakan pilih kategori</p>
        </header>

        <section className="mt-6 grid gap-4">
          <Link href="/makanan" className="no-underline">
            <div className="flex items-center gap-3 border rounded-2xl p-4 shadow-sm active:opacity-80">
              <div className="h-14 w-14 rounded-xl bg-red-600/10 flex items-center justify-center text-2xl">🍽️</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Makanan</div>
                <div className="text-xs text-slate-500">Tap untuk lihat daftar tenant</div>
              </div>
            </div>
          </Link>

          <Link href="/minuman" className="no-underline">
            <div className="flex items-center gap-3 border rounded-2xl p-4 shadow-sm opacity-60 active:opacity-80">
              <div className="h-14 w-14 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">🥤</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Minuman</div>
                <div className="text-xs text-slate-500">(Akan hadir di pembaruan berikutnya)</div>
              </div>
            </div>
          </Link>
        </section>

        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 text-center text-xs text-slate-500">
          {/* footer intentionally blank per request */}
          &nbsp;
        </footer>
      </div>
    </main>
  );
}
