"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PublicSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = inputRef.current.value.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <>
      {/* Search Icon Button */}
      {!open && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="relative z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-lg border border-black/10 shadow-sm"
          aria-label="Open search"
        >
          <Search className="h-5 w-5 text-black" />
        </motion.button>
      )}

      {/* Expanded Search */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            {/* Search Bar */}
            <motion.form
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[520px] rounded-full bg-white/70 backdrop-blur-xl border border-black/10 shadow-lg flex items-center gap-3 px-5 py-3"
            >
              <Search className="h-5 w-5 text-black/70" />

              <input
                ref={inputRef}
                type="text"
                placeholder="Search wigs, bundles, textures…"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-black/50"
              />

              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-black/5" aria-label="Close search">
                <X className="h-4 w-4 text-black/70" />
              </button>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
