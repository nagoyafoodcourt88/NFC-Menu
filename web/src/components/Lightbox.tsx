'use client';
import { useState } from "react";

export default function Lightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="h-20 w-20 rounded-lg object-cover cursor-zoom-in"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl" />
        </div>
      )}
    </>
  );
}
