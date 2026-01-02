import { API_V1 } from "./apis";
import { get } from "./http";

export type GuestCourseCategory = {
  id: number;
  name: string;
};

export type GuestCourseTeacher = {
  id: number;
  name: string;
};

export type GuestCourseCoverImage = {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
};

export type GuestCourse = {
  id: number;
  name: string;
  description: string;
  duration: number;
  category: GuestCourseCategory;
  teacher: GuestCourseTeacher;
  cover_image: GuestCourseCoverImage | null;
  students_count: number;
  lessons_count: number;
};

export type GuestCoursesResponse = {
  body?: {
    data?: GuestCourse[];
  };
};

export async function getGuestCourses(
  page: number = 1
): Promise<GuestCourse[]> {
  const res = await get<GuestCoursesResponse>(
    `${API_V1}/guest/courses?page=${encodeURIComponent(String(page))}`
  );
  return res?.body?.data ?? [];
}
