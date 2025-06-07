import { itda } from "api/itda";
import { type EmptyItdaResponse, type ItdaResponse, parseEmptyResponse, parseResponse } from "api/response";
import type { User } from "api/user";
import type { DateString, Time } from "lib/time";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  instructorName: string;
  startDate: DateString | null;
  endDate: DateString | null;
  durationWeeks: number;
  /** Comma separated numbers */
  lectureDay: string | null;
  lectureTime: Time | null;
  /** Comma separated numbers */
  assignmentDueDay: string | null;
  assignmentDueTime: Time | null;
  difficultyLevel: Difficulty;
  isAssignmentPublic: boolean;
  courseThumbnail: string | null;
  entryCode: string;
  init: boolean;
  user: User;
}

export async function getCourse(id: number) {
  const res = await itda.client.get<ItdaResponse<Course>>(`courses/${id}`);
  return parseResponse(res);
}

interface GetMyCoursesOptions {
  userId: number;
}

export async function getMyCourses({ userId }: GetMyCoursesOptions) {
  // TODO: userId doesn't matter. Backend returns data according to access token.
  const res = await itda.client.get<ItdaResponse<Course[]>>(`courses/${userId}/my-courses`);
  return parseResponse(res);
}

interface EnterCourseOptions {
  userId: number;
  code: string;
}

export async function enterCourse({ userId, code }: EnterCourseOptions) {
  const res = await itda.client.post<EmptyItdaResponse>(`courses/enter/${userId}`, {
    searchParams: { entryCode: code },
  });
  return parseEmptyResponse(res);
}

interface UpdateCourseSettingsOptions {
  courseId: number;
  userId: number;
  data: {
    title: string;
    instructorName: string;
    startDate: DateString;
    durationWeeks: number;
    lectureDay: number[];
    lectureTime: Time | null;
    assignmentDueDay: number[];
    assignmentDueTime: Time | null;
    difficultyLevel: Difficulty;
    isAssignmentPublic: boolean;
  };
}

export async function updateCourseSettings({ courseId, userId, data }: UpdateCourseSettingsOptions) {
  const res = await itda.client.put<ItdaResponse<Course>>(`courses/${courseId}/${userId}/setting`, {
    json: data,
  });
  return parseResponse(res);
}
