import React from "react";
import Image, { type StaticImageData } from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import backgroundImage from "../../assets/background.png";
import underlineIcon from "../../assets/blueUnderline.svg";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { login } from "../../../../services/auth";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import SepratorWithText from "../seprator-with-text";
import Link from "next/link";
import SignInOptions from "../sign-in-options";
import { Popup } from "@/components/shared/popup";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import useLang from "@/components/hooks/useLang";
import { cn } from "@/lib/utils";

type AuthPageProps = {
  image?: StaticImageData | string;
  imageAlt?: string;
  onLoginSuccess?: () => void;
};

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginFormPage({
  image = backgroundImage,
  imageAlt,
  onLoginSuccess,
}: AuthPageProps) {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const router = useRouter();
  const { isArabic } = useLang();
  const resolvedImageAlt = imageAlt ?? t("authImageAlt");

  const loginSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().min(1, t("emailRequired")),
        password: z
          .string()
          .min(1, t("passwordRequired"))
          .min(8, t("passwordMin")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = React.useCallback(
    async (values: LoginFormValues) => {
      setFormError(null);

      try {
        await login({
          email: values.email.trim(),
          password: values.password,
        });
        onLoginSuccess?.();
        setIsSuccessOpen(true);
      } catch (error) {
        let message = t("loginErrorGeneric");

        if (error instanceof AxiosError) {
          const data = error.response?.data as {
            message?: string;
            errors?: Record<string, unknown>;
          };

          if (data?.message) {
            message = data.message;
          }

          if (data?.errors) {
            Object.entries(data.errors).forEach(([field, detail]) => {
              if (field !== "email" && field !== "password") return;

              const resolvedMessage = Array.isArray(detail)
                ? detail.find(
                    (item) => typeof item === "string" && item.trim().length > 0
                  )
                : typeof detail === "string"
                ? detail
                : undefined;

              if (resolvedMessage) {
                setError(field as keyof LoginFormValues, {
                  type: "server",
                  message: resolvedMessage,
                });
              }
            });
          }
        }

        setFormError(message);
      }
    },
    [onLoginSuccess, setError, t]
  );

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSuccessOpenChange = React.useCallback(
    (open: boolean) => {
      setIsSuccessOpen(open);
      if (!open) {
        void router.push("/");
      }
    },
    [router]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={t("authBackgroundAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/65 backdrop-blur-md" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full justify-center px-4  sm:px-6 md:px-12 md:pb-0">
        <div className="grid min-h-full w-full max-w-[1372px] items-stretch gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="relative flex min-h-full items-center md:self-center">
            {/* Form card container */}
            <div className="flex md:h-full w-full max-h-[736px] max-w-[600px] flex-col justify-center rounded-3xl bg-white/40 px-6 py-8 md:py-4 sm:px-8 md:px-12 my-6">
              <div>
                <h1 className="text-center text-2xl md:text-3xl font-bold leading-10 md:leading-14 text-secondary">
                  {t("loginTitleLine1")} <br /> {t("loginTitleLine2")}{" "}
                  <span className="inline-flex flex-col items-center font-normal">
                    {t("loginTitleAction")}
                    <Image
                      src={underlineIcon}
                      alt={t("underlineAlt")}
                      width={160}
                      height={20}
                      className="-mt-1 h-auto w-40 md:w-56"
                      priority
                    />
                  </span>
                </h1>
              </div>

              <form
                className="mt-10 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t("emailLabel")}</Label>
                  <Input
                    id="email"
                    type="text"
                    autoComplete="username"
                    className="h-12"
                    placeholder={t("emailPlaceholder")}
                    aria-invalid={errors.email ? "true" : undefined}
                    {...register("email")}
                  />
                  {errors.email?.message ? (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("passwordLabel")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="h-12 pe-12"
                      placeholder={t("passwordPlaceholder")}
                      aria-invalid={errors.password ? "true" : undefined}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={cn(
                        "absolute inset-y-0 right-3 flex items-center text-sm font-medium cursor-pointer",
                        isArabic && "right-auto left-3"
                      )}
                      aria-label={
                        showPassword ? t("hidePassword") : t("showPassword")
                      }
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                  {errors.password?.message ? (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                {formError ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {formError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="secondary"
                  className="h-12 w-full font-normal text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("signingIn") : t("signIn")}{" "}
                  {!isSubmitting && (
                    <ArrowRight
                      className={cn(
                        "min-w-6 min-h-5",
                        isArabic && "rotate-180"
                      )}
                    />
                  )}
                </Button>
              </form>
              <p className="text-sm text-primary text-center pt-5 cursor-pointer">
                {t("forgotPassword")}
              </p>
              <SepratorWithText className="pt-6">
                {t("otherSignInOptions")}
              </SepratorWithText>
              <SignInOptions className="pt-5" />
              <p className="pt-6 text-center text-[11px] md:text-xs">
                {t("dontHaveAccount")}{" "}
                <span className="text-primary cursor-pointer">
                  <Link href="/register">{t("signUp")}</Link>
                </span>
              </p>
            </div>

            <div className="hidden">
              <Image
                src={image}
                alt={resolvedImageAlt || "Authentication page image"}
                width={240}
                height={180}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="relative hidden min-h-full md:flex md:h-full md:items-end md:justify-end md:self-end">
            <div className="relative w-full overflow-hidden rounded-2xl md:h-[520px] md:w-[500px] md:self-end md:ml-auto">
              <Image
                src={image}
                alt={resolvedImageAlt || "Authentication page image"}
                fill
                className="object-cover object-bottom"
                sizes="(min-width: 768px) 45vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <Popup
        variant="success"
        open={isSuccessOpen}
        onOpenChange={handleSuccessOpenChange}
        showCloseButton={false}
        title={t("loginSuccessTitle")}
        description={t("loginSuccessDescription")}
        buttons={[
          {
            label: t("startLearning"),
            variant: "secondary",
            onClick: () => handleSuccessOpenChange(false),
            icon: (
              <ArrowRight
                className={cn("min-w-6 min-h-5", isArabic && "rotate-180")}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
