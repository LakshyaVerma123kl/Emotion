// frontend/src/utils/emotion-config.ts

import { EmotionType, EmotionConfig } from "@/types/emotion";

export const emotionConfigs: Record<EmotionType, EmotionConfig> = {
  Happy: {
    name: "Happy",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    description: "Feeling joyful and content",
    icon: "😊",
  },
  Sad: {
    name: "Sad",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    description: "Feeling down or melancholy",
    icon: "😢",
  },
  Anxious: {
    name: "Anxious",
    color: "text-orange-800",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    description: "Feeling worried or nervous",
    icon: "😰",
  },
  Angry: {
    name: "Angry",
    color: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    description: "Feeling frustrated or irritated",
    icon: "😠",
  },
  Excited: {
    name: "Excited",
    color: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    description: "Feeling enthusiastic and energetic",
    icon: "🤩",
  },
  Confused: {
    name: "Confused",
    color: "text-purple-800",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    description: "Feeling uncertain or puzzled",
    icon: "😕",
  },
  Calm: {
    name: "Calm",
    color: "text-teal-800",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-300",
    description: "Feeling peaceful and relaxed",
    icon: "😌",
  },
  Frustrated: {
    name: "Frustrated",
    color: "text-pink-800",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-300",
    description: "Feeling blocked or hindered",
    icon: "😤",
  },
  Neutral: {
    name: "Neutral",
    color: "text-gray-800",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    description: "Feeling balanced and stable",
    icon: "😐",
  },
  Hopeful: {
    name: "Hopeful",
    color: "text-emerald-800",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-300",
    description: "Feeling optimistic about the future",
    icon: "🌟",
  },
  Disappointed: {
    name: "Disappointed",
    color: "text-slate-800",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    description: "Feeling let down or dissatisfied",
    icon: "😞",
  },
};

export const getEmotionConfig = (emotion: string): EmotionConfig => {
  return emotionConfigs[emotion as EmotionType] || emotionConfigs.Neutral;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return "text-green-600";
  if (confidence >= 0.6) return "text-yellow-600";
  if (confidence >= 0.4) return "text-orange-600";
  return "text-red-600";
};

export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.6) return "Medium";
  if (confidence >= 0.4) return "Low";
  return "Very Low";
};
