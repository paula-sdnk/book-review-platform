import { Button } from "@book-review-platform/ui/components/button";
import { Input } from "@book-review-platform/ui/components/input";
import { Label } from "@book-review-platform/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim().toLowerCase(),
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z
          .email("Invalid email address")
          .trim()
          .toLowerCase()
          .min(1, "Email is required")
          .max(254, "Email must be at most 254 characters"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(128, "Password must be at most 128 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#b48953]">
          Book Review Platform
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#4b3527]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#6b5646]">
          Sign in to continue your reading journey.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-[#4b3527]">
                Email
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-11 rounded-lg border-[#dcc9ac] bg-[#fffdf8] text-[#4b3527] placeholder:text-[#a48b78]"
                placeholder="Enter your email"
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-sm text-red-600">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-[#4b3527]">
                Password
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-11 rounded-lg border-[#dcc9ac] bg-[#fffdf8] text-[#4b3527] placeholder:text-[#a48b78]"
                placeholder="Enter your password"
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-sm text-red-600">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="mx-auto flex h-11 w-64 cursor-pointer rounded-3xl bg-[#c49a63] text-white hover:bg-[#b48953]"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="cursor-pointer text-sm font-medium text-[#8b6a46] transition hover:text-[#6f5235]"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  );
}
