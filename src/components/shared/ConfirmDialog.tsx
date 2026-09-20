import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel,
  isPending,
  variant = "default",
}: ConfirmDialogProps) {
  // Hooks
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("action-cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className={cn(
              variant === "destructive" &&
                "bg-destructive text-white hover:bg-destructive/90",
            )}
          >
            {isPending ? t("action-deleting") : (confirmLabel ?? t("action-confirm"))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
