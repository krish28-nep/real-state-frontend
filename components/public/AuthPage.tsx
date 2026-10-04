"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage, login, register as registerAccount } from "@/lib/api";

type AuthMode = "login" | "register";

interface AuthPageProps {
  initialMode: AuthMode;
}

interface AuthFormValues {
  fullName?: string;
  role?: "TENANT" | "LANDLORD";
  email: string;
  password: string;
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: { role: "TENANT" },
  });

  async function submitForm(values: AuthFormValues) {
    setSuccessMessage("");
    setIsSuccess(false);

    try {
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
      } else {
        await registerAccount({
          fullName: values.fullName ?? "",
          email: values.email,
          password: values.password,
          role: values.role ?? "TENANT",
        });
      }
      setSuccessMessage(mode === "login" ? "You are signed in." : "Your account is ready.");
      setIsSuccess(true);
    } catch (error: unknown) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error, "We could not complete your request. Check your details and try again."),
      });
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    reset({ role: "TENANT" });
    setSuccessMessage("");
    setIsSuccess(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 pb-10 pt-24">
      <section className="w-full max-w-md">
        <div className="mb-7 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Rent Estate
          </p>
          <h1 className="text-3xl font-bold text-primary">
            {mode === "login" ? "Welcome back" : "Find your place"}
          </h1>
          <p className="mt-2 text-sm text-neutral">
            {mode === "login"
              ? "Sign in to continue to your account."
              : "Create an account to start your next chapter."}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-8">
          <div className="mb-7 grid grid-cols-2 rounded-md bg-surface-muted p-1" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => changeMode("login")}
              className={`min-h-10 rounded px-3 text-sm font-semibold transition-colors ${mode === "login" ? "bg-surface text-primary shadow-sm" : "text-neutral hover:text-primary"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => changeMode("register")}
              className={`min-h-10 rounded px-3 text-sm font-semibold transition-colors ${mode === "register" ? "bg-surface text-primary shadow-sm" : "text-neutral hover:text-primary"}`}
            >
              Create account
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
            {mode === "register" && (
              <>
                <label className="block space-y-1.5 text-sm font-medium text-primary">
                  Full name
                  <input
                    autoComplete="name"
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    placeholder="Your name"
                    {...register("fullName", { required: "Enter your full name" })}
                  />
                  {errors.fullName && <span className="block text-xs font-normal text-danger">{errors.fullName.message}</span>}
                </label>
                <label className="block space-y-1.5 text-sm font-medium text-primary">
                  Account type
                  <select
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    {...register("role", { required: "Choose an account type" })}
                  >
                    <option value="TENANT">I am looking to rent</option>
                    <option value="LANDLORD">I have a property to list</option>
                  </select>
                  {errors.role && <span className="block text-xs font-normal text-danger">{errors.role.message}</span>}
                </label>
              </>
            )}

            <label className="block space-y-1.5 text-sm font-medium text-primary">
              Email address
              <input
                autoComplete="email"
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                placeholder="you@example.com"
                type="email"
                {...register("email", {
                  required: "Enter your email address",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })}
              />
              {errors.email && <span className="block text-xs font-normal text-danger">{errors.email.message}</span>}
            </label>

            <label className="block space-y-1.5 text-sm font-medium text-primary">
              Password
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                placeholder="At least 8 characters"
                type="password"
                {...register("password", {
                  required: "Enter your password",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
              />
              {errors.password && <span className="block text-xs font-normal text-danger">{errors.password.message}</span>}
            </label>

            {errors.root?.server?.message && (
              <p className="text-sm text-danger" role="alert">{errors.root.server.message}</p>
            )}
            {successMessage && (
              <p className={`text-sm ${isSuccess ? "text-green-700" : "text-danger"}`} role="status">
                {successMessage}
              </p>
            )}

            <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          {isSuccess && (
            <Link className="mt-4 block text-center text-sm font-semibold text-primary underline decoration-secondary underline-offset-4" href="/">
              Continue browsing
            </Link>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-neutral">
          By continuing, you agree to use Rent Estate responsibly.
        </p>
      </section>
    </main>
  );
}