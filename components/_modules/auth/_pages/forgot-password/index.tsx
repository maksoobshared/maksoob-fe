import SectionContainer from "@/components/ui/section-container";
import { useRedirectIfAuthenticated } from "@/components/utils/session-guard";
import { Loader2 } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");

  const { isRedirecting } = useRedirectIfAuthenticated({
    redirectTo: "/",
  });

  if (isRedirecting) {
    return (
      <SectionContainer>
        <Loader2 className="animate-spin h-12 w-12 mx-auto" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <p>Forgot Password</p>
    </SectionContainer>
  );
}
