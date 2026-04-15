import { type ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@albatroaz/ui/components/alert-dialog";
import { Button } from "@albatroaz/ui/components/button";

type Props = {
  buttonTitle: ReactNode;
  buttonVariant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link";
  buttonSize?: "sm" | "default" | "lg" | "xl" | "icon" | "icon-sm";
  buttonClassName?: string;
  buttonId?: string;
  buttonTestId?: string;
  modalTitle: string;
  description: ReactNode;
  continueLabel: string;
  cancelLabel: string;
  onContinue: () => void | Promise<void>;
};

export const ConfirmDialog = ({
  buttonTitle,
  buttonVariant = "secondary",
  buttonSize = "sm",
  buttonClassName,
  buttonId,
  buttonTestId,
  modalTitle,
  description,
  continueLabel,
  cancelLabel,
  onContinue,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          id={buttonId}
          data-testid={buttonTestId}
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
        >
          {buttonTitle}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onContinue()}>
            {continueLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
