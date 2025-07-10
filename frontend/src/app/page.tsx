"use client";

import React from "react";
import { useEmotionAnalysis } from "@/hooks/useEmotionAnalysis";
import { EmotionForm } from "@/components/emotion/EmotionForm";
import { EmotionResult } from "@/components/emotion/EmotionResult";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { result, isLoading, error, analyze, reset } = useEmotionAnalysis();

  const handleAnalyze = async (text: string, useRealModel: boolean) => {
    await analyze({
      text,
      use_real_model: useRealModel,
      include_suggestions: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Emotion Reflection Tool
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Understanding your emotions is the first step to emotional
              wellness. Share your thoughts and gain insights with our advanced
              AI analysis.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error.message}
            </div>
          )}
          {!result ? (
            <EmotionForm
              onSubmit={handleAnalyze}
              loading={isLoading}
              error={error ? error.message : undefined}
            />
          ) : (
            <EmotionResult result={result} onReset={reset} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-50 dark:bg-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This tool provides general insights and is not a substitute for
          professional mental health advice. For support, consult a licensed
          professional.
        </p>
      </footer>
    </div>
  );
}
