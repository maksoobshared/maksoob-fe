import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function SepratorWithText({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-sm text-[#888888]",
        className
      )}
    >
      <span className="h-px flex-1 bg-[#888888]" aria-hidden="true" />
      {children ? <span className="whitespace-nowrap">{children}</span> : null}
      <span className="h-px flex-1 bg-[#888888]" aria-hidden="true" />
    </div>
  );
}
