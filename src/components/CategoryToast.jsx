import React from 'react';

export default function CategoryToast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className="bg-white/95 text-stone-900 px-4 py-2 rounded-lg shadow-lg border border-[#6b0f1a]/10 backdrop-blur-sm">
        <div className="text-sm font-medium">Category</div>
        <div className="text-sm text-zinc-600">{message}</div>
      </div>
    </div>
  );
}
