import { API_V1 } from "./apis";
import { get } from "./http";

export type BannerImage = {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
};

export type Banner = {
  id: number;
  title: string;
  image: BannerImage | null;
  image_mobile: BannerImage | null;
};

export type BannersListResponse = {
  body?: Banner[];
};

export async function getBannersList(): Promise<Banner[]> {
  const res = await get<BannersListResponse>(`${API_V1}/banners/list`);
  return res?.body ?? [];
}
