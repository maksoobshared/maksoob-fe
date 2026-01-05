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
};

export type UserCoursesResponse = {
  body?: {
    data?: UserCourse[];
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

export async function getGuestCourseDetails(
  id: string | number
): Promise<GuestCourseDetails | null> {
  const res = await get<GuestCourseDetailsResponse>(
    `${API_V1}/guest/courses/${encodeURIComponent(String(id))}`
  );
  return res?.body ?? null;
}

export async function getUserCourses(
  perPage: number = 100
): Promise<UserCourse[]> {
  const res = await get<UserCoursesResponse>(
    `${API_V1}/courses?per_page=${encodeURIComponent(String(perPage))}`
  );
  return res?.body?.data ?? [];
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
