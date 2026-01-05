"use client";
import { Loader2 } from "lucide-react";
import SectionContainer from "@/components/ui/section-container";
import { useRedirectIfAuthenticated } from "@/components/utils/session-guard";
import React from "react";
import LoginFormPage from "../../components/auth-page/login-page";
import loginPersonImage from "../../assets/loginPerson.png";
import { useRouter } from "next/router";

function resolveSafeRedirectTarget(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export default function LoginPage() {
  const [isPostLogin, setIsPostLogin] = React.useState(false);
  const router = useRouter();

  const redirectTo = React.useMemo(() => {
    return resolveSafeRedirectTarget(router.query.redirect, "/");
  }, [router.query.redirect]);

  const { isRedirecting } = useRedirectIfAuthenticated({
    redirectTo,
    suppressRedirect: isPostLogin,
  });

  if (isRedirecting) {
    return (
      <SectionContainer>
        <Loader2 className="animate-spin h-12 w-12 mx-auto" />
      </SectionContainer>
    );
  }

  return (
    <LoginFormPage
      image={loginPersonImage}
      onLoginSuccess={() => setIsPostLogin(true)}
    />
  );
}
