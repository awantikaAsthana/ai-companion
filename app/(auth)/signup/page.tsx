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
      title="Create account"
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
      submitLabel="Sign up"
      onSubmit={handleSignup}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </>
      }
    />
  );
}

