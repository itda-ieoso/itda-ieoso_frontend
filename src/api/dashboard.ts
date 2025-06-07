import { itda } from "api/itda";
import { type ItdaResponse, parseResponse } from "api/response";
import type { DateString, DateTime } from "lib/time";

type SubmissionStatus = "SUBMITTED" | "LATE" | "NOT_SUBMITTED";

interface Video {
  videoId: number;
  videoTitle: string;
  videoUrl: string | null;
  startDate: DateTime;
  endDate: DateTime;
  contentOrderId: number;
  contentType: string;
  contentOrderIndex: number;
}

interface Material {
  materialId: number;
  materialTitle: string;
  MaterialFile: string;
  startDate: DateTime;
  endDate: DateTime;
  originalFilename: string;
  materialHistoryStatus: boolean;
  contentOrderId: number;
  contentType: string;
  contentOrderIndex: number;
}

interface Assignment {
  assignmentId: number;
  assignmentTitle: string;
  getAssignmentDescription: string | null;
  startDate: DateTime;
  endDate: DateTime;
  submissionStatus: SubmissionStatus | null;
  contentOrderId: number;
  contentType: string;
  contentOrderIndex: number;
}

interface Todo {
  courseId: number;
  creatorId: number;
  courseTitle: string;
  videoDtos: Video[];
  materialDtos: Material[];
  assignmentDtos: Assignment[];
}

interface GetDashboardOptions {
  userId: number;
  date: DateString;
}

export async function getDashboard({ userId, date }: GetDashboardOptions) {
  const res = await itda.client.get<ItdaResponse<Todo[]>>(`lectures/dashboard/${userId}`, {
    searchParams: { date },
  });
  return parseResponse(res);
}
