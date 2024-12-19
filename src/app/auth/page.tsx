import { LoginForm } from "@/components/custom/auth/login-form";

export default function AuthPage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-blue-500">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </section>
  );
}
