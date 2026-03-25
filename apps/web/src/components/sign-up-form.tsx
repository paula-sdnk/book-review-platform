import { Button } from "@book-review-platform/ui/components/button";
import { Input } from "@book-review-platform/ui/components/input";
import { Label } from "@book-review-platform/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
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
        <h1 className="mt-3 text-3xl font-bold text-[#4b3527]">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-[#6b5646]">
          Save books, share thoughts and build your reading space.
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
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-[#4b3527]">
                Name
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-11 rounded-lg border-[#dcc9ac] bg-[#fffdf8] text-[#4b3527] placeholder:text-[#a48b78]"
                placeholder="Enter your name"
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-sm text-red-600">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

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
                placeholder="Create a password"
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
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="cursor-pointer text-sm font-medium text-[#8b6a46] transition hover:text-[#6f5235]"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
