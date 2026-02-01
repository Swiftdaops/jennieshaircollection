"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden px-3 py-4 sm:p-6">
      <div className="mx-auto w-full max-w-xl space-y-5">
        <h1 className="text-xl font-semibold text-stone-950">
          Store Settings
        </h1>

        {/* Store Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            Store Name
          </label>
          <Input
            placeholder="e.g. Maduka Store"
            className="w-full"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            WhatsApp Number
          </label>
          <Input
            placeholder="+234 801 234 5678"
            className="w-full"
          />
        </div>

        {/* Currency */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            Currency
          </label>
          <Input
            placeholder="₦"
            className="w-full"
          />
        </div>

        {/* Auto message */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            Order Auto-Message Template
          </label>
          <textarea
            rows={4}
            placeholder="Hello, your order has been received…"
            className="w-full resize-y rounded-md border border-stone-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button className="w-full sm:w-auto">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
