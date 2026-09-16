"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(data: Record<string, string>): Promise<string | null> {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (res.ok) {
      router.push("/app");
      return null;
    }

    const body = await res.json().catch(() => null);
    return body?.error ?? "Something went wrong. Please try again.";
  }

  return (
    <AuthForm
      title="Begin your story"
      subtitle="Create an account to meet a companion made for you."
      fields={[
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Your name",
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Min. 8 characters",
          autoComplete: "new-password",
        },
      ]}
      submitLabel="Create Account"
      onSubmit={handleSignup}
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C9A46A] hover:text-[#E8D0C5] transition-colors font-medium underline underline-offset-4"
          >
            Log in
          </Link>
        </>
      }
    />
  );
}
