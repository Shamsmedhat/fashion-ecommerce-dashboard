import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { PageHeader } from "@/components/shared/PageHeader";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  // Hooks
  const { t } = useTranslation();

  // Store
  const user = useAuthStore((state) => state.user);

  // Variables
  const rows = [
    { label: t("field-name"), value: user?.name },
    { label: t("field-email"), value: user?.email },
    { label: t("field-phone"), value: user?.phone },
    { label: t("field-role"), value: user?.role },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t("settings-title")} description={t("settings-subtitle")} />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings-profile")}</CardTitle>
          <CardDescription>{t("settings-profile-readonly")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-medium capitalize">{row.value ?? "—"}</dd>
              </div>
            ))}
          </dl>

          {/* Addresses */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("field-addresses")}</p>
            {user?.addresses && user.addresses.length > 0 ? (
              <ul className="space-y-2">
                {user.addresses.map((address, index) => (
                  <li
                    key={`${address.label}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm"
                  >
                    <span>
                      <span className="font-medium">{address.label}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {address.street}, {address.city}
                      </span>
                    </span>
                    {address.isDefault ? (
                      <Badge variant="secondary">{t("address-default")}</Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("settings-no-addresses")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings-preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("language")}</span>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("theme")}</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
