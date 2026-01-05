import { API_V1 } from "./apis";
import { get, post } from "./http";

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

export type GuestCourseStatus = {
  value: string;
  name: string;
};

export type GuestCourseVisibility = {
  value: string;
  name: string;
};

export type GuestCourseDetails = {
  id: number;
  name: string;
  duration: number;
  description: string;
  review_notes: string | null;
  created_at: string;
  status: GuestCourseStatus;
  visibility: GuestCourseVisibility;
  category: GuestCourseCategory;
  teacher: GuestCourseTeacher;
  cover_image: GuestCourseCoverImage | null;
};

export type GuestCoursesResponse = {
  body?: {
    data?: GuestCourse[];
  };
};

export type GuestCourseDetailsResponse = {
  body?: GuestCourseDetails;
};

export type UserCourse = {
  id: number;
  name?: string;
  description?: string;
  duration?: number;
  status?: {
    value: string;
    name: string;
  };
  visibility?: {
    value: string;
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
  cover_image?: GuestCourseCoverImage | null;
  students_count?: number;
  lessons_count?: number;
  review_notes?: string | null;
  created_at?: string;
  category?: {
    id: number;
    name: string;
  };
};

export type UserCoursesResponse = {
  body?: {
    data?: UserCourse[];
    pagination?: {
      current_page?: number;
      per_page?: number;
      last_page?: number;
      total?: number;
      links?: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
      }>;
      next_page_url?: string | null;
      prev_page_url?: string | null;
    };
    meta?: {
      enrolled_courses?: number;
      lesson_completed?: number;
    };
  };
};

export type UserCoursesPagination = NonNullable<
  NonNullable<UserCoursesResponse["body"]>["pagination"]
>;

export type UserCoursesMeta = NonNullable<
  NonNullable<UserCoursesResponse["body"]>["meta"]
>;

export type UserCoursesPage = {
  data: UserCourse[];
  pagination?: UserCoursesPagination;
  meta?: UserCoursesMeta;
};

export async function getGuestCourses(
  page: number = 1
): Promise<GuestCourse[]> {
  const res = await get<GuestCoursesResponse>(
    `${API_V1}/guest/courses?page=${encodeURIComponent(String(page))}`
  );
  return res?.body?.data ?? [];
}

export async function getGuestCourseDetails(
  id: string | number
): Promise<GuestCourseDetails | null> {
  const res = await get<GuestCourseDetailsResponse>(
    `${API_V1}/guest/courses/${encodeURIComponent(String(id))}`
  );
  return res?.body ?? null;
}

export async function getUserCourses(
  arg: number | { page?: number; perPage?: number } = 100
): Promise<UserCourse[]> {
  const page = typeof arg === "number" ? 1 : arg.page ?? 1;
  const perPage = typeof arg === "number" ? arg : arg.perPage ?? 100;

  const res = await get<UserCoursesResponse>(
    `${API_V1}/courses?page=${encodeURIComponent(
      String(page)
    )}&per_page=${encodeURIComponent(String(perPage))}`
  );
  return res?.body?.data ?? [];
}

export async function getUserCoursesPage(arg?: {
  page?: number;
  perPage?: number;
}): Promise<UserCoursesPage> {
  const page = arg?.page ?? 1;
  const perPage = arg?.perPage ?? 15;

  const res = await get<UserCoursesResponse>(
    `${API_V1}/courses?page=${encodeURIComponent(
      String(page)
    )}&per_page=${encodeURIComponent(String(perPage))}`
  );

  return {
    data: res?.body?.data ?? [],
    pagination: res?.body?.pagination,
    meta: res?.body?.meta,
  };
}

export async function enrollCourse(id: string | number): Promise<unknown> {
  return post(
    `${API_V1}/courses/${encodeURIComponent(String(id))}/enrollments`
  );
}

export type CourseSectionName = {
  ar: string;
  en: string;
};

export type CourseSection = {
  id: number;
  name: CourseSectionName | string;
  duration: number;
};

export type CourseSectionResponse = {
  body?: CourseSection[];
};

export type CourseLessonType = "youtube" | "pdf" | string;

export type CourseLesson = {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: CourseLessonType;
  video_url?: string | null;
  pdf?: {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    url: string;
  } | null;
  pdf_url?: string | null;
  file_url?: string | null;
  created_at: string;
  section: {
    id: number;
    name: string;
  };
};

export type SectionLessonsResponse = {
  body?: CourseLesson[];
};

export async function getCourseSections(
  courseId: string | number
): Promise<CourseSection[]> {
  const res = await get<CourseSectionResponse>(
    `${API_V1}/courses/${encodeURIComponent(String(courseId))}/sections`
  );
  return res?.body ?? [];
}

export async function getSectionLessons(
  sectionId: string | number
): Promise<CourseLesson[]> {
  const res = await get<SectionLessonsResponse>(
    `${API_V1}/sections/${encodeURIComponent(String(sectionId))}/lessons`
  );
  return res?.body ?? [];
}

export async function completeLesson(
  lessonId: string | number
): Promise<unknown> {
  return post(
    `${API_V1}/lessons/${encodeURIComponent(String(lessonId))}/completions`
  );
}
