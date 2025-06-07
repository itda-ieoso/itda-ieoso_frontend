import ky, { type KyInstance, type KyRequest, type KyResponse, type NormalizedOptions } from "ky";
import { Err, None, Ok, type Option, type Result } from "lib/rust";

class ItdaClient {
  public client: KyInstance;
  private accessToken: Option<string>;
  private readonly refreshToken: Option<string>;

  constructor() {
    this.accessToken = None();
    this.refreshToken = None();
    this.client = ky.create({
      prefixUrl: import.meta.env.VITE_API_URL,
      hooks: {
        beforeRequest: [
          async (request) => {
            request.headers.set("Authorization", this.authorizationHeader());
          },
        ],
        afterResponse: [
          async (request, options, response) => {
            if (response.status === 401) {
              return this.retryUnauthenticatedRequest(request, options, response);
            }
            return response;
          },
        ],
      },
      throwHttpErrors: false,
    });
  }

  private authorizationHeader(): string {
    const token = this.accessToken.unwrapOr("");
    return `Bearer ${token}`;
  }

  private async reIssueAccessToken(): Promise<Result<string, Error>> {
    if (this.refreshToken.isNone()) {
      return Err(new Error("Refresh token is not set"));
    }
    const res = await this.client.post<{ jwtToken: string }>("oauth/reissuetoken", {
      json: { refreshToken: this.refreshToken.unwrap() },
    });
    if (res.ok) {
      const { jwtToken } = await res.json();
      return Ok(jwtToken);
    }
    return Err(new Error("Failed to get access token"));
  }

  private async refreshAccessToken(): Promise<Result<null, Error>> {
    const accessToken = await this.reIssueAccessToken();
    if (accessToken.isOk()) {
      this.accessToken = accessToken.ok();
      return Ok(null);
    }
    return Err(
      new Error("Failed to refresh access token", {
        cause: accessToken.unwrapErr(),
      }),
    );
  }

  private async retryUnauthenticatedRequest(
    request: KyRequest,
    options: NormalizedOptions,
    response: KyResponse,
  ): Promise<KyResponse> {
    const refreshRes = await this.refreshAccessToken();
    if (refreshRes.isErr()) {
      return response;
    }
    return ky(request, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: this.authorizationHeader(),
      },
    });
  }
}

export const itda = new ItdaClient();
