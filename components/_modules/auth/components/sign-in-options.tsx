import React from "react";
import Image from "next/image";
import googleIcon from "../assets/google.svg";
import facebookIcon from "../assets/facebook.svg";
import appleIcon from "../assets/apple.svg";
import { cn } from "@/lib/utils";
const providers = [
  { id: "google", label: "Continue with Google", icon: googleIcon },
  { id: "facebook", label: "Continue with Facebook", icon: facebookIcon },
  { id: "apple", label: "Continue with Apple", icon: appleIcon },
];

export default function SignInOptions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="flex size-12 items-center justify-center rounded-lg border-2 cursor-pointer border-secondary/60 bg-transparent text-secondary transition hover:border-secondary hover:bg-secondary/10"
          aria-label={provider.label}
        >
          <Image
            src={provider.icon}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
            priority={false}
          />
        </button>
      ))}
    </div>
  );
}
