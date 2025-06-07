import { itda } from "api/itda";
import { type ItdaResponse, parseResponse } from "api/response";
import type { TutorialStatus } from "api/tutorial";

export interface User {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  service: boolean;
  privacy: boolean;
  marketing: boolean;
  tutorial: TutorialStatus;
}

export async function getMe() {
  const res = await itda.client.get<ItdaResponse<User>>("users/user-info");
  return parseResponse(res);
}
