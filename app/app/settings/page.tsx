import { MemorySettings } from "@/components/settings/memory-settings";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#F5E9E5] tracking-tight">
          Settings
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#BFA8A8] font-light">
          Shape how your companions experience you.
        </p>
      </div>

      <div className="rounded-2xl border border-[#430D15]/50 bg-[#120507]/60 p-5 sm:p-7">
        <MemorySettings />
      </div>
    </div>
  );
}
