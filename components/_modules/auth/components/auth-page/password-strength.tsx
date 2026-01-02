import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import useTranslation from "next-translate/useTranslation";

type PasswordRequirement = {
  id: string;
  labelKey: string;
  test: (value: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    id: "length",
    labelKey: "passwordRequirementLength",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    labelKey: "passwordRequirementUppercase",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    labelKey: "passwordRequirementNumber",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    id: "lowercase",
    labelKey: "passwordRequirementLowercase",
    test: (value: string) => /[a-z]/.test(value),
  },
] as const;

export type PasswordStatus = {
  statuses: boolean[];
  satisfied: number;
  meetsAll: boolean;
};

export function getPasswordStatus(password: string): PasswordStatus {
  const statuses = PASSWORD_REQUIREMENTS.map((requirement) =>
    requirement.test(password)
  );
  const satisfied = statuses.filter(Boolean).length;

  return {
    statuses,
    satisfied,
    meetsAll: satisfied === PASSWORD_REQUIREMENTS.length,
  };
}

type PasswordStrengthProps = {
  password?: string;
  status?: PasswordStatus;
};

function PasswordStrength({ password = "", status }: PasswordStrengthProps) {
  const { t } = useTranslation("auth");
  const { statuses, satisfied } = React.useMemo(
    () => status ?? getPasswordStatus(password),
    [password, status]
  );

  const title = React.useMemo(() => {
    if (satisfied <= 2) return t("passwordStrengthTitleWeak");
    if (satisfied === 3) return t("passwordStrengthTitleMedium");
    return t("passwordStrengthTitleStrong");
  }, [satisfied, t]);

  const segmentClassForIndex = React.useCallback(
    (index: number) => {
      if (index >= satisfied) {
        return "bg-[#A7A7A7]";
      }

      if (satisfied === 4) {
        return "bg-primary";
      }

      if (satisfied === 3) {
        return "bg-[#FFD581]";
      }

      return "bg-[#B07500]";
    },
    [satisfied]
  );

  return (
    <div className="min-h-[104px] sm:min-h-[120px] w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-secondary">{title}</p>
      <div className="mt-3 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors bg-[#A7A7A7]",
              segmentClassForIndex(index)
            )}
          />
        ))}
      </div>

      <p className="mt-3 text-[10px] font-medium text-black">
        {t("passwordStrengthMustHave")}
      </p>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
        {PASSWORD_REQUIREMENTS.map((requirement, index) => {
          const isMet = statuses[index];
          return (
            <div
              key={requirement.id}
              className={cn(
                "flex items-center gap-2",
                isMet ? "text-primary" : "text-[#A7A7A7]"
              )}
            >
              {isMet ? (
                <Check className="size-3 sm:size-4" />
              ) : (
                <span className="text-base leading-none">-</span>
              )}
              <span className={cn(isMet ? "text-black" : "")}>
                {t(requirement.labelKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PasswordStrength;
