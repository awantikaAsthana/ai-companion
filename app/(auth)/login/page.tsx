"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(data: Record<string, string>): Promise<string | null> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      title="Welcome back"
      subtitle="Sign in to continue your story with your companion."
      fields={[
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
          placeholder: "Your password",
          autoComplete: "current-password",
        },
      ]}
      submitLabel="Enter Ecstasy"
      onSubmit={handleLogin}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#C9A46A] hover:text-[#E8D0C5] transition-colors font-medium underline underline-offset-4"
          >
            Sign up
          </Link>
        </>
      }
    />
  );
}
