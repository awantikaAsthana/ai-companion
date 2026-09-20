"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
}

interface AuthFormProps {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  submitLabel: string;
  footer?: ReactNode;
  onSubmit: (data: Record<string, string>) => Promise<string | null>;
}

export function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  footer,
  onSubmit,
}: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(data: Record<string, string>): boolean {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = data[field.name]?.trim() ?? "";
      if (!value) {
        errors[field.name] = `${field.label} is required`;
      } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.name] = "Invalid email address";
      } else if (field.name === "password" && value.length < 8) {
        errors[field.name] = "Password must be at least 8 characters";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const field of fields) {
      data[field.name] = (formData.get(field.name) as string) ?? "";
    }

    if (!validate(data)) return;

    setSubmitting(true);
    try {
      const err = await onSubmit(data);
      if (err) setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-[420px] rounded-3xl border border-[#430D15]/80 bg-[#120507]/65 p-7 sm:p-9 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(201,164,106,0.15)] transition-all duration-300 hover:border-[#C9A46A]/30">
      {/* Decorative top badge */}
      <div className="flex flex-col items-center text-center mb-7">
        <div className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A46A]/30 bg-[#21080C]/80 shadow-[0_0_20px_rgba(110,7,23,0.5)]">
          <Sparkles className="h-4 w-4 text-[#C9A46A]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#F5E9E5]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs sm:text-sm font-light text-[#BFA8A8]">
            {subtitle}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-[#8F1025]/60 bg-[#430D15]/50 px-4 py-3 text-xs text-[#F5E9E5] backdrop-blur-md shadow-lg flex items-center gap-2">
          <span className="text-[#E8D0C5]">✦</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A46A] mb-1.5"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              disabled={submitting}
              className="w-full rounded-xl border border-[#430D15]/80 bg-[#090405]/75 px-4 py-3 text-sm text-[#F5E9E5] placeholder-[#BFA8A8]/35 transition-all duration-200 focus:border-[#C9A46A]/70 focus:bg-[#120507]/90 focus:outline-none focus:ring-1 focus:ring-[#C9A46A]/40 disabled:opacity-50"
            />
            {fieldErrors[field.name] && (
              <p className="mt-1.5 text-xs text-[#E8A0A8]">
                {fieldErrors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6E0717] via-[#8F1025] to-[#6E0717] px-6 py-3.5 text-xs sm:text-sm font-medium uppercase tracking-[0.16em] text-[#F5E9E5] shadow-[0_0_25px_rgba(110,7,23,0.45)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(181,30,58,0.65)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{submitting ? "Please wait…" : submitLabel}</span>
            {!submitting && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>
        </div>
      </form>

      {footer && (
        <div className="mt-6 text-center text-xs text-[#BFA8A8]">
          {footer}
        </div>
      )}
    </div>
  );
}
