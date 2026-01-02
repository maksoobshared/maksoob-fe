import React from "react";

type SectionContainerProps = {
  children: React.ReactNode;
};

export default function SectionContainer({ children }: SectionContainerProps) {
  return (
    <div className="mx-auto items-center justify-center min-h-screen max-w-[1248px] px-2 flex flex-col">
      {children}
    </div>
  );
}
