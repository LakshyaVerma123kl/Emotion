// frontend/src/utils/api.ts
import {
  EmotionAnalysisRequest,
  EmotionAnalysisResponse,
  ApiError,
} from "@/types/emotion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:800";

export const analyzeEmotion = async (
  request: EmotionAnalysisRequest
): Promise<EmotionAnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/emotion/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(`API error: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred", 0); // Fixed: Added status code
  }
};
