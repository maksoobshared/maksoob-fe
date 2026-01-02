import * as React from "react";
import Image from "next/image";

import successIcon from "./assets/success.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PopupButtonConfig = {
  label: React.ReactNode;
  icon?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "children">;

type PopupBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  contentClassName?: string;
  showCloseButton?: boolean;
};

type PopupChildrenVariant = {
  variant: "children";
  children: React.ReactNode;
};

type PopupSuccessVariant = {
  variant: "success";
  title: React.ReactNode;
  description?: React.ReactNode;
  buttons?: PopupButtonConfig[];
};

export type PopupProps = PopupBaseProps &
  (PopupChildrenVariant | PopupSuccessVariant);

export function Popup(props: PopupProps) {
  const {
    trigger,
    contentClassName,
    showCloseButton = true,
    open,
    onOpenChange,
  } = props;

  let content: React.ReactNode;

  if (props.variant === "success") {
    const { title, description, buttons } = props;

    content = (
      <div className="flex flex-col items-center text-center pb-4">
        <div className="flex  items-center justify-center ">
          <Image src={successIcon} alt="Success" width={225} height={225} />
        </div>

        <DialogTitle className="mt-4 text-3xl  text-secondary">
          {title}
        </DialogTitle>

        {description ? (
          <DialogDescription className="mt-6 text-base text-black">
            {description}
          </DialogDescription>
        ) : null}

        {buttons?.length ? (
          <div className="mt-10 flex w-full flex-wrap justify-center gap-3">
            {buttons.map(
              ({ label, icon, className, ...buttonProps }, index) => (
                <Button
                  key={index}
                  className={cn(
                    "flex min-h-[56px] flex-1 items-center justify-center gap-2 max-w-[439px]",
                    className
                  )}
                  {...buttonProps}
                >
                  <span className="text-lg text-center">{label}</span>
                  {icon ? (
                    <span className="inline-flex items-center justify-center">
                      {icon}
                    </span>
                  ) : null}
                </Button>
              )
            )}
          </div>
        ) : null}
      </div>
    );
  } else {
    content = props.children;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          props.variant === "success"
            ? "max-w-[600px] w-full rounded-4xl"
            : "max-w-[600px] w-full",
          contentClassName
        )}
        showCloseButton={showCloseButton}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
}

export type { PopupButtonConfig };
