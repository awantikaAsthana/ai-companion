"use client";

import { useEffect, useState, useCallback } from "react";
import { Brain, HelpCircle } from "lucide-react";

const MEMORY_STEPS = [20, 30, 40, 50] as const;
type MemoryStep = (typeof MEMORY_STEPS)[number];

const CREDIT_LABELS: Record<MemoryStep, string> = {
  20: "Lower credit usage",
  30: "Moderate credit usage",
  40: "Higher credit usage",
  50: "Maximum context · highest credit usage",
};

export function MemorySettings() {
  const [value, setValue] = useState<MemoryStep>(20);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.memoryMessageLimit && MEMORY_STEPS.includes(data.memoryMessageLimit)) {
          setValue(data.memoryMessageLimit);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const handleChange = useCallback(async (newValue: MemoryStep) => {
    setValue(newValue);
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryMessageLimit: newValue }),
      });
    } catch {
      // ponytail: silent fail for settings, not critical path
    } finally {
      setSaving(false);
    }
  }, []);

  const stepIndex = MEMORY_STEPS.indexOf(value);
  const percentage = (stepIndex / (MEMORY_STEPS.length - 1)) * 100;

  if (!loaded) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#C9A46A]" />
          <h3 className="font-serif text-sm sm:text-base font-medium text-[#F5E9E5] tracking-wide">
            Conversation Memory
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="text-[#BFA8A8] hover:text-[#F5E9E5] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Memory information"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#BFA8A8] font-light mb-4 leading-relaxed">
        How much of your recent conversation should I remember?
      </p>

      {/* Info tooltip */}
      {showInfo && (
        <div className="mb-4 rounded-xl border border-[#430D15]/60 bg-[#120507]/90 p-3 text-xs text-[#BFA8A8] font-light leading-relaxed">
          This controls how many recent messages are included as context when
          your companion responds. More messages means richer continuity — but
          uses more credits per reply. Durable memories (facts about you) are
          always included separately.
        </div>
      )}

      {/* Slider Track */}
      <div className="relative mb-3">
        {/* Step labels */}
        <div className="flex justify-between mb-2 px-0.5">
          {MEMORY_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => handleChange(step)}
              className={`text-[11px] sm:text-xs font-medium transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation rounded-lg ${
                step === value
                  ? "text-[#C9A46A]"
                  : "text-[#BFA8A8]/60 hover:text-[#BFA8A8]"
              }`}
            >
              {step}
            </button>
          ))}
        </div>

        {/* Custom range track */}
        <div className="relative h-2 rounded-full bg-[#21080C] border border-[#430D15]/60">
          {/* Filled portion */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#C9A46A]/60 to-[#C9A46A] transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />

          {/* Step dots */}
          {MEMORY_STEPS.map((step, i) => {
            const pos = (i / (MEMORY_STEPS.length - 1)) * 100;
            return (
              <button
                key={step}
                type="button"
                onClick={() => handleChange(step)}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 flex items-center justify-center touch-manipulation"
                style={{ left: `${pos}%` }}
                aria-label={`Set memory to ${step} messages`}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    i <= stepIndex
                      ? "h-2.5 w-2.5 bg-[#C9A46A] shadow-[0_0_8px_rgba(201,164,106,0.4)]"
                      : "h-2 w-2 bg-[#430D15] border border-[#430D15]"
                  }`}
                />
              </button>
            );
          })}

          {/* Draggable thumb — native range input layered invisibly for keyboard/touch */}
          <input
            type="range"
            min={0}
            max={MEMORY_STEPS.length - 1}
            step={1}
            value={stepIndex}
            onChange={(e) => handleChange(MEMORY_STEPS[Number(e.target.value)])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-manipulation"
            aria-label="Conversation memory depth"
            aria-valuetext={`${value} messages`}
          />
        </div>
      </div>

      {/* Value display */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg sm:text-xl text-[#F5E9E5] font-light">
          {value} messages
          {saving && (
            <span className="ml-2 text-xs text-[#C9A46A] animate-pulse">
              saving…
            </span>
          )}
        </span>
      </div>

      {/* Credit usage indicator */}
      <p className="mt-1.5 text-[11px] sm:text-xs text-[#BFA8A8]/70 font-light">
        {CREDIT_LABELS[value]}
      </p>
    </div>
  );
}
