"use client";
import { Loader2 } from "lucide-react";
import SectionContainer from "@/components/ui/section-container";
import { useRedirectIfAuthenticated } from "@/components/utils/session-guard";
import React from "react";
import LoginFormPage from "../../components/auth-page/login-page";
import loginPersonImage from "../../assets/loginPerson.png";

export default function LoginPage() {
  const [isPostLogin, setIsPostLogin] = React.useState(false);

  const { isRedirecting } = useRedirectIfAuthenticated({
    redirectTo: "/",
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
