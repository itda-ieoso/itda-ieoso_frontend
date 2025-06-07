import type { KyResponse } from "ky";
import { Err, Ok, type Result } from "lib/rust";

export interface ItdaResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface EmptyItdaResponse {
  success: boolean;
  message: string;
}

export async function parseResponse<T>(response: KyResponse<ItdaResponse<T>>): Promise<Result<T, Error>> {
  if (response.ok) {
    const data = await response.json();
    if (data.success) {
      return Ok(data.data);
    }
    return Err(new Error(data.message));
  }
  return Err(new Error(`HTTP error: ${response.status} ${response.statusText}`));
}

export async function parseEmptyResponse(response: KyResponse<EmptyItdaResponse>): Promise<Result<null, Error>> {
  if (response.ok) {
    const data = await response.json();
    if (data.success) {
      return Ok(null);
    }
    return Err(new Error(data.message));
  }
  return Err(new Error(`HTTP error: ${response.status} ${response.statusText}`));
}
