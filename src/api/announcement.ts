import { itda } from "api/itda";
import { type EmptyItdaResponse, type ItdaResponse, parseEmptyResponse, parseResponse } from "api/response";
import type { DateTime } from "lib/time";

interface Announcement {
  announcementId: number;
  instructorName: string;
  announcementTitle: string;
  viewCount: number;
  createdAt: DateTime;
}

interface DetailedAnnouncement extends Announcement {
  announcementContent: string;
}

interface GetAnnouncementsOptions {
  courseId: number;
  userId: number;
}

export async function getAnnouncements({ courseId, userId }: GetAnnouncementsOptions) {
  const res = await itda.client.get<ItdaResponse<Announcement[]>>(`announcements/${courseId}/${userId}`);
  return parseResponse(res);
}

interface GetAnnouncementOptions {
  courseId: number;
  userId: number;
  announcementId: number;
}

export async function getAnnouncement({ courseId, userId, announcementId }: GetAnnouncementOptions) {
  const res = await itda.client.get<ItdaResponse<DetailedAnnouncement>>(
    `announcements/${courseId}/${userId}/${announcementId}`,
  );
  return parseResponse(res);
}

interface CreateAnnouncementOptions {
  courseId: number;
  userId: number;
  title: string;
  content: string;
}

export async function createAnnouncement({ courseId, userId, title, content }: CreateAnnouncementOptions) {
  const res = await itda.client.post<ItdaResponse<DetailedAnnouncement>>(`announcements/${courseId}/${userId}`, {
    json: { title, content },
  });
  return parseResponse(res);
}

interface EditAnnouncementOptions {
  courseId: number;
  userId: number;
  announcementId: number;
  title: string;
  content: string;
}

export async function editAnnouncement({ courseId, userId, announcementId, title, content }: EditAnnouncementOptions) {
  const res = await itda.client.patch<ItdaResponse<DetailedAnnouncement>>(
    `announcements/${courseId}/${userId}/${announcementId}`,
    {
      json: { title, content },
    },
  );
  return parseResponse(res);
}

interface DeleteAnnouncementOptions {
  courseId: number;
  userId: number;
  announcementId: number;
}

export async function deleteAnnouncement({ courseId, userId, announcementId }: DeleteAnnouncementOptions) {
  const res = await itda.client.delete<EmptyItdaResponse>(`announcements/${courseId}/${userId}/${announcementId}`);
  return parseEmptyResponse(res);
}
