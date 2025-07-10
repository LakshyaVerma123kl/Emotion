// frontend/src/types/emotion.ts
export interface EmotionAnalysisRequest {
  text: string;
  use_real_model?: boolean;
  include_suggestions?: boolean;
}

export interface EmotionAnalysisResponse {
  emotion: string;
  confidence: number;
  secondary_emotions: string[];
  suggestions: string[];
  emotion_intensity: "low" | "medium" | "high";
  timestamp: string;
  processing_time: number;
  analysis_id: string;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export interface UseEmotionAnalysisReturn {
  analyze: (
    request: EmotionAnalysisRequest
  ) => Promise<EmotionAnalysisResponse>;
  reset: () => void;
  isLoading: boolean;
  result: EmotionAnalysisResponse | null;
  error: ApiError | null;
}

// Add these definitions
export type EmotionType =
  | "Happy"
  | "Sad"
  | "Anxious"
  | "Angry"
  | "Excited"
  | "Confused"
  | "Calm"
  | "Frustrated"
  | "Neutral"
  | "Hopeful"
  | "Disappointed";

export interface EmotionConfig {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  icon: string;
}
