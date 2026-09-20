import { AuthBackground } from "@/components/auth/auth-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <AuthBackground />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}