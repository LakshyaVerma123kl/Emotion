// frontend/src/hooks/useEmotionAnalysis.ts
import { useState, useCallback } from "react";
import {
  EmotionAnalysisRequest,
  EmotionAnalysisResponse,
  ApiError,
  UseEmotionAnalysisReturn,
} from "@/types/emotion";
import { apiClient } from "@/lib/api-client";

interface UseEmotionAnalysisState {
  result: EmotionAnalysisResponse | null;
  isLoading: boolean;
  error: ApiError | null;
}

export const useEmotionAnalysis = (): UseEmotionAnalysisReturn => {
  const [state, setState] = useState<UseEmotionAnalysisState>({
    result: null,
    isLoading: false,
    error: null,
  });

  const analyze = useCallback(
    async (
      request: EmotionAnalysisRequest
    ): Promise<EmotionAnalysisResponse> => {
      if (!request.text.trim()) {
        const error = new ApiError("Please enter some text to analyze", 400);
        setState((prev) => ({
          ...prev,
          error,
        }));
        throw error;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await apiClient.analyzeEmotion({
          ...request,
          include_suggestions: true,
        });
        setState((prev) => ({ ...prev, result, isLoading: false }));
        return result;
      } catch (error) {
        let apiError: ApiError;

        if (error instanceof ApiError) {
          apiError = error;
        } else {
          apiError = new ApiError(
            error instanceof Error ? error.message : "Unknown error",
            0
          );
        }

        if (apiError.status === 0) {
          apiError = new ApiError(
            "Unable to connect to the server. Please check your connection.",
            0
          );
        } else if (apiError.status === 408) {
          apiError = new ApiError("Request timed out. Please try again.", 408);
        } else if (apiError.status === 500) {
          apiError = new ApiError("Server error. Please try again later.", 500);
        } else if (apiError.status === 400) {
          apiError = new ApiError(
            "Invalid input. Please check your text and try again.",
            400
          );
        }

        setState((prev) => ({
          ...prev,
          error: apiError,
          isLoading: false,
        }));

        throw apiError;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      result: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    result: state.result,
    isLoading: state.isLoading,
    error: state.error,
    analyze,
    reset,
  };
};
