import React from "react";
import { EmotionAnalysisResponse } from "@/types/emotion";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmotionResultProps {
  result: EmotionAnalysisResponse;
  onReset: () => void;
}

export const EmotionResult: React.FC<EmotionResultProps> = ({
  result,
  onReset,
}) => {
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      happy:
        "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700",
      sad: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
      anxious:
        "from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600",
      angry: "from-red-400 to-red-600 dark:from-red-500 dark:to-red-700",
      excited:
        "from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600",
      calm: "from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600",
      frustrated:
        "from-orange-400 to-red-500 dark:from-orange-500 dark:to-red-600",
      confident:
        "from-indigo-400 to-purple-600 dark:from-indigo-500 dark:to-purple-700",
      hopeful:
        "from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600",
      disappointed:
        "from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700",
      overwhelmed:
        "from-pink-400 to-purple-500 dark:from-pink-500 dark:to-purple-600",
      grateful:
        "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600",
      lonely:
        "from-indigo-400 to-blue-500 dark:from-indigo-500 dark:to-blue-600",
      stressed:
        "from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700",
      proud:
        "from-violet-400 to-purple-600 dark:from-violet-500 dark:to-purple-700",
      neutral: "from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600",
    };
    return (
      colors[emotion.toLowerCase()] ||
      "from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600"
    );
  };

  const getEmotionIcon = (emotion: string): string => {
    const icons: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      angry: "😠",
      excited: "🤗",
      calm: "😌",
      frustrated: "😤",
      confident: "😎",
      hopeful: "🌟",
      disappointed: "😞",
      overwhelmed: "😵‍💫",
      grateful: "🙏",
      lonely: "😔",
      stressed: "😓",
      proud: "🏆",
      neutral: "🤔",
    };
    return icons[emotion.toLowerCase()] || "🤔";
  };

  const getIntensityColor = (intensity: string): string => {
    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-600",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-600",
    };
    return colors[intensity as keyof typeof colors] || colors.medium;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8)
      return "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700";
    if (confidence >= 0.6)
      return "from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600";
    return "from-red-400 to-red-600 dark:from-red-500 dark:to-red-700";
  };

  const getConfidenceText = (confidence: number): string => {
    if (confidence >= 0.9) return "Very High";
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Good";
    if (confidence >= 0.4) return "Moderate";
    return "Low";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-950 border-b border-gray-100 dark:border-gray-600">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Emotional Insight
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analysis completed in {result.processing_time}s • ID:{" "}
              {result.analysis_id}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Primary Emotion Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div
                className={`bg-gradient-to-r ${getEmotionColor(
                  result.emotion
                )} rounded-full p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                <span className="text-6xl">
                  {getEmotionIcon(result.emotion)}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-50 dark:bg-gray-800 rounded-full p-2 shadow-md">
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${getConfidenceColor(
                    result.confidence
                  )}`}
                ></div>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4 capitalize">
              {result.emotion}
            </h3>
            <div className="flex items-center justify-center mt-3 space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntensityColor(
                  result.emotion_intensity
                )}`}
              >
                {result.emotion_intensity.charAt(0).toUpperCase() +
                  result.emotion_intensity.slice(1)}{" "}
                Intensity
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-white dark:text-gray-100 bg-gradient-to-r ${getConfidenceColor(
                  result.confidence
                )}`}
              >
                {getConfidenceText(result.confidence)} Confidence
              </span>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Confidence Level
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getConfidenceColor(
                  result.confidence
                )} transition-all duration-1000 ease-out`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Secondary Emotions */}
          {result.secondary_emotions.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">🎭</span>
                Related Emotions
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {result.secondary_emotions.map((emotion, index) => (
                  <div
                    key={emotion}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-2xl mr-2">
                      {getEmotionIcon(emotion)}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {emotion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      {result.suggestions.length > 0 && (
        <Card className="overflow-hidden shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-950 border-b border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="mr-2">💡</span>
              Personalized Suggestions
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-md"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-emerald-600 dark:text-emerald-200 font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Card */}
      <Card className="overflow-hidden shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-950 border-b border-gray-100 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <span className="mr-2">🧠</span>
            Understanding Your Emotions
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
              {result.confidence >= 0.8 && (
                <span className="font-semibold text-green-700 dark:text-green-400">
                  Our analysis shows high confidence in identifying your
                  emotional state.
                </span>
              )}
              {result.confidence < 0.8 && result.confidence >= 0.6 && (
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                  We have moderate confidence in this emotional analysis.
                </span>
              )}
              {result.confidence < 0.6 && (
                <span className="font-semibold text-red-700 dark:text-red-400">
                  This is a preliminary analysis with lower confidence.
                </span>
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              Feeling{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {result.emotion.toLowerCase()}
              </strong>{" "}
              is a natural human experience. Your emotions are valid and provide
              important information about your inner world.
              {result.emotion_intensity === "high" && (
                <span className="text-orange-700 dark:text-orange-400 font-medium">
                  {" "}
                  The high intensity suggests this emotion is significantly
                  impacting you right now.
                </span>
              )}
              {result.suggestions.length > 0 && (
                <span>
                  {" "}
                  Consider exploring the suggestions above to help navigate
                  these feelings in a healthy way.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white dark:text-gray-100 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Analyze Another Emotion
          </span>
        </Button>
      </div>
    </div>
  );
};
