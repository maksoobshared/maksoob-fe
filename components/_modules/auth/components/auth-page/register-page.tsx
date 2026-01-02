import React from "react";
import Image, { type StaticImageData } from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import backgroundImage from "../../assets/background.png";
import underlineIcon from "../../assets/blueUnderline.svg";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Checkbox } from "../../../../ui/checkbox";
import { register as registerUser } from "../../../../services/auth";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SepratorWithText from "../seprator-with-text";
import Link from "next/link";
import SignInOptions from "../sign-in-options";
import PasswordStrength, { getPasswordStatus } from "./password-strength";
import { Popup } from "@/components/shared/popup";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import useLang from "@/components/hooks/useLang";
import { cn } from "@/lib/utils";

type AuthPageProps = {
  image?: StaticImageData | string;
  imageAlt?: string;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  marketingOptIn?: boolean;
};

type RegisterFormValuesParsed = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  marketingOptIn: boolean;
};

export default function RegisterFormPage({
  image = backgroundImage,
  imageAlt,
}: AuthPageProps) {
  const { t } = useTranslation("auth");
  const { isArabic } = useLang();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const router = useRouter();

  const resolvedImageAlt = imageAlt ?? t("authImageAlt");

  const registerSchema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t("fullNameRequired")),
          email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
          password: z.string().min(8, t("passwordMin")),
          passwordConfirmation: z.string().min(8, t("confirmPasswordMin")),
          marketingOptIn: z.boolean().default(false),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.passwordConfirmation) {
            ctx.addIssue({
              code: "custom",
              message: t("passwordsDoNotMatch"),
              path: ["passwordConfirmation"],
            });
          }
        }),
    [t]
  );

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues, any, RegisterFormValuesParsed>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      marketingOptIn: false,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleContinue = React.useCallback(async () => {
    setFormError(null);
    const isValid = await trigger(["name", "email"]);
    if (isValid) {
      setStep(2);
    }
  }, [trigger]);

  const onSubmit = React.useCallback<SubmitHandler<RegisterFormValuesParsed>>(
    async (values) => {
      setFormError(null);

      try {
        await registerUser({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          password_confirmation: values.passwordConfirmation,
        });
        setIsSuccessOpen(true);
      } catch (error) {
        let message = t("signUpErrorGeneric");

        if (error instanceof AxiosError) {
          const data = error.response?.data as {
            message?: string;
            errors?: Record<string, unknown>;
          };

          if (data?.message) {
            message = data.message;
          }

          if (data?.errors) {
            const fieldMap: Record<string, keyof RegisterFormValuesParsed> = {
              name: "name",
              email: "email",
              password: "password",
              password_confirmation: "passwordConfirmation",
            };

            Object.entries(data.errors).forEach(([field, detail]) => {
              const target = fieldMap[field];
              if (!target) return;

              const resolvedMessage = Array.isArray(detail)
                ? detail.find(
                    (item) => typeof item === "string" && item.trim().length > 0
                  )
                : typeof detail === "string"
                ? detail
                : undefined;

              if (resolvedMessage) {
                setError(target, {
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
    [setError, t]
  );

  const handlePasswordSubmit = React.useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const handleSuccessOpenChange = React.useCallback((open: boolean) => {
    setIsSuccessOpen(open);
  }, []);

  const passwordValue = watch("password", "");
  const passwordStatus = React.useMemo(
    () => getPasswordStatus(passwordValue),
    [passwordValue]
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
            <div className="flex md:h-full w-full min-h-[600px] max-h-[736px] max-w-[600px] flex-col rounded-3xl bg-white/40 px-6 py-6 md:py-8 sm:px-8 md:px-12">
              <div className="relative flex items-center justify-center">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormError(null);
                    }}
                    className="cursor-pointer absolute start-0 top-1 flex items-center gap-1 text-xs md:text-sm font-medium text-secondary hover:text-secondary/80"
                  >
                    <ArrowLeft
                      className={cn("size-4", isArabic && "rotate-180")}
                    />
                    {t("back")}
                  </button>
                ) : null}

                {step === 1 ? (
                  <h1 className="text-center text-2xl md:text-3xl font-bold leading-10 md:leading-14 text-secondary">
                    {t("signUpTitle")}{" "}
                    <span className="inline-flex flex-col items-center font-bold">
                      {t("withEmail")}
                      <Image
                        src={underlineIcon}
                        alt={t("underlineAlt")}
                        width={160}
                        height={20}
                        className="-mt-2 h-auto w-40 md:w-56"
                        priority
                      />
                    </span>
                  </h1>
                ) : (
                  <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold leading-tight md:leading-14 text-secondary mt-8 md:mt-0">
                    {t("createYour")}
                    <br />
                    <span className="inline-flex flex-col items-center font-bold">
                      {t("password")}
                      <Image
                        src={underlineIcon}
                        alt={t("underlineAlt")}
                        width={240}
                        height={18}
                        className="md:-mt-1 h-auto w-32 sm:w-44 md:w-60"
                        priority
                      />
                    </span>
                  </h1>
                )}
              </div>

              <form
                className="mt-10 flex flex-col gap-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (step === 1) {
                    void handleContinue();
                    return;
                  }

                  if (passwordStatus.meetsAll) {
                    void handlePasswordSubmit();
                  }
                }}
                noValidate
              >
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("fullNameLabel")}</Label>
                      <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        className="h-12"
                        placeholder={t("fullNamePlaceholder")}
                        aria-invalid={errors.name ? "true" : undefined}
                        {...register("name")}
                      />
                      {errors.name?.message ? (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("emailLabel")}</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
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

                    <Controller
                      control={control}
                      name="marketingOptIn"
                      render={({ field }) => (
                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-secondary">
                          <Checkbox
                            id="marketingOptIn"
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked) =>
                              field.onChange(Boolean(checked))
                            }
                          />
                          <span className="text-left text-[10px] leading-4 md:leading-normal md:text-xs text-black">
                            {t("marketingOptInText")}
                          </span>
                        </label>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t("passwordLabel")}</Label>
                      <Input
                        id="password"
                        type="text"
                        autoComplete="new-password"
                        className="h-12"
                        placeholder={t("createPasswordPlaceholder")}
                        aria-invalid={errors.password ? "true" : undefined}
                        {...register("password")}
                      />
                      {errors.password?.message ? (
                        <p className="text-sm text-destructive">
                          {errors.password.message}
                        </p>
                      ) : null}
                    </div>
                    <PasswordStrength
                      password={passwordValue}
                      status={passwordStatus}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirmation">
                        {t("confirmPasswordLabel")}
                      </Label>
                      <Input
                        id="passwordConfirmation"
                        type="text"
                        autoComplete="new-password"
                        className="h-12"
                        placeholder={t("confirmPasswordPlaceholder")}
                        aria-invalid={
                          errors.passwordConfirmation ? "true" : undefined
                        }
                        {...register("passwordConfirmation")}
                      />
                      {errors.passwordConfirmation?.message ? (
                        <p className="text-sm text-destructive">
                          {errors.passwordConfirmation.message}
                        </p>
                      ) : null}
                    </div>
                  </>
                )}

                {step === 2 && formError ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {formError}
                  </div>
                ) : null}

                <div className="pt-2">
                  {step === 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12 w-full font-semibold"
                      onClick={() => {
                        void handleContinue();
                      }}
                    >
                      {t("continue")}{" "}
                      <ArrowRight
                        className={cn("ms-2 size-5", isArabic && "rotate-180")}
                      />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12 w-full font-semibold"
                      disabled={isSubmitting || !passwordStatus.meetsAll}
                      onClick={() => {
                        if (passwordStatus.meetsAll) {
                          void handlePasswordSubmit();
                        }
                      }}
                    >
                      {isSubmitting ? t("creatingAccount") : t("createAccount")}
                      <ArrowRight
                        className={cn("ms-2 size-5", isArabic && "rotate-180")}
                      />
                    </Button>
                  )}
                </div>
              </form>

              {step === 1 ? (
                <div className="mt-auto pt-6">
                  <SepratorWithText>{t("otherSignUpOptions")}</SepratorWithText>
                  <SignInOptions className="pt-5" />
                  <p className="pt-5 text-center text-[10px]">
                    {t("bySigningUp")}{" "}
                    <span className="cursor-pointer text-primary">
                      <Link href="/terms" className="underline">
                        {t("termsOfService")}
                      </Link>
                    </span>{" "}
                    {t("and")}{" "}
                    <span className="cursor-pointer text-primary">
                      <Link href="/privacy" className="underline">
                        {t("privacyPolicy")}
                      </Link>
                    </span>
                  </p>
                  <p className="pt-6 text-center text-xs">
                    {t("alreadyHaveAccount")}{" "}
                    <span className="cursor-pointer text-primary">
                      <Link href="/login" className="underline">
                        {t("logIn")}
                      </Link>
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            <div className="hidden">
              <Image
                src={image}
                alt={resolvedImageAlt || "Person image"}
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
                alt={resolvedImageAlt || "Person image"}
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
        title={t("registerSuccessTitle")}
        description={t("registerSuccessDescription")}
        buttons={[
          {
            label: t("goToLogin"),
            variant: "secondary",
            onClick: () => {
              handleSuccessOpenChange(false);
              void router.push("/login");
            },
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
