import SectionContainer from "@/components/ui/section-container";
import { useRedirectIfAuthenticated } from "@/components/utils/session-guard";
import { Loader2 } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import RegisterFormPage from "../../components/auth-page/register-page";
import registerPersonImage from "../../assets/registerPerson.png";

export default function RegisterPage() {
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
    <RegisterFormPage image={registerPersonImage} imageAlt="register person" />
  );
}
