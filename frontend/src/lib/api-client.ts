// frontend/src/lib/api-client.ts
import {
  EmotionAnalysisRequest,
  EmotionAnalysisResponse,
  ApiError,
} from "@/types/emotion";

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(
    baseUrl: string = "http://localhost:8000",
    timeout: number = 10000
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        0
      );
    }
  }

  async analyzeEmotion(
    request: EmotionAnalysisRequest
  ): Promise<EmotionAnalysisResponse> {
    return this.request<EmotionAnalysisResponse>("/api/v1/emotion/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>(
      "/api/v1/emotion/health"
    );
  }
}

// Create singleton instance
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
);
