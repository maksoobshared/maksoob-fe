import SectionContainer from "@/components/ui/section-container";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import auth from "@/components/services/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Popup } from "@/components/shared/popup";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation("home");
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  return (
    <SectionContainer>
      <p>HomePage</p>
      <Button
        className="w-[250px] h-[56px] text-lg my-10"
        onClick={() => auth.logout()}
      >
        Sign Out
      </Button>
      <Link href="/login" className="text-xl underline py-5">
        Go to Login
      </Link>
      <Link href="/register" className="text-xl underline py-5">
        Go to register
      </Link>

      <Button
        className="mt-6 w-[250px] h-[56px] text-lg"
        variant="secondary"
        onClick={() => setIsSuccessOpen(true)}
      >
        Show Success Popup
      </Button>

      <Popup
        variant="success"
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Login Successful!"
        description="Login successful! Welcome to your Learning area"
        buttons={[
          {
            label: "Start Learning",
            variant: "secondary",
            onClick: () => setIsSuccessOpen(false),
            icon: <ArrowRight className="min-w-6 min-h-5" />,
          },
        ]}
      />
    </SectionContainer>
  );
}
