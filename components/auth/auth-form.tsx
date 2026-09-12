"use client";

import { useState, type FormEvent, type ReactNode } from "react";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
}

interface AuthFormProps {
  title: string;
  fields: FieldConfig[];
  submitLabel: string;
  footer?: ReactNode;
  onSubmit: (data: Record<string, string>) => Promise<string | null>;
}

export function AuthForm({
  title,
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
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-900/50 border border-red-700 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-neutral-300 mb-1"
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
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            {fieldErrors[field.name] && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors[field.name]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Please wait…" : submitLabel}
        </button>
      </form>

      {footer && <div className="mt-4 text-center text-sm text-neutral-400">{footer}</div>}
    </div>
  );
}

