import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { buildLoginSchema, type LoginFields } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  // Hooks
  const { t } = useTranslation();
  const { isPending, login } = useLogin();

  // State
  const [showPassword, setShowPassword] = useState(false);

  // Form & validation
  const form = useForm<LoginFields>({
    resolver: zodResolver(buildLoginSchema(t)),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Functions
  function onSubmit(values: LoginFields) {
    login(values);
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">{t("login-title")}</CardTitle>
        <CardDescription>{t("login-subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Identifier */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  {/* Label */}
                  <FormLabel>{t("login-identifier-label")}</FormLabel>

                  {/* Field */}
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        inputMode="text"
                        autoComplete="username"
                        placeholder={t("login-identifier-placeholder")}
                        className="h-10 ps-9 text-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  {/* Feedback */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* Label */}
                  <FormLabel>{t("login-password-label")}</FormLabel>

                  {/* Field */}
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={t("login-password-placeholder")}
                        className="h-10 px-9 text-sm"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t(
                          showPassword ? "login-hide-password" : "login-show-password",
                        )}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>

                  {/* Feedback */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" size="lg" className="h-10 w-full" disabled={isPending}>
              {isPending ? t("login-submitting") : t("login-submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
