import { API_V1 } from "./apis";
import { get } from "./http";

export type Faq = {
  id: number;
  question: string;
  answer: string;
};

type FaqsListResponse = {
  body?: Faq[];
};

export async function getFaqsList(lang?: "ar" | "en"): Promise<Faq[]> {
  const res = await get<FaqsListResponse>(
    `${API_V1}/faqs/list`,
    lang
      ? {
          headers: {
            "Accept-Language": lang,
          },
        }
      : undefined
  );

  return res?.body ?? [];
}
