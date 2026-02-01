"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function FloatingNextButton({ href = "/admin/orders", label = "Next" }) {
  const router = useRouter();
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("floatingNextBtnPos");
      if (raw) setPos(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    function onPointerDown(e) {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      el.classList.add("opacity-90");
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const left = Math.max(8, Math.min(window.innerWidth - rectWidth(), origLeft + dx));
      const top = Math.max(8, Math.min(window.innerHeight - rectHeight(), origTop + dy));
      el.style.left = left + "px";
      el.style.top = top + "px";
    }

    function rectWidth() { return el.getBoundingClientRect().width; }
    function rectHeight() { return el.getBoundingClientRect().height; }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch (e) {}
      el.classList.remove("opacity-90");
      // persist
      const rect = el.getBoundingClientRect();
      const saved = { left: rect.left, top: rect.top };
      setPos(saved);
      try { localStorage.setItem("floatingNextBtnPos", JSON.stringify(saved)); } catch (e) {}
    }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (pos) {
      el.style.left = pos.left + "px";
      el.style.top = pos.top + "px";
      el.style.position = "fixed";
    } else {
      // default position: middle right
      el.style.right = "16px";
      el.style.top = "50%";
      el.style.transform = "translateY(-50%)";
      el.style.position = "fixed";
    }
  }, [pos]);

  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
      className="z-50 fixed right-4 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  );
}
