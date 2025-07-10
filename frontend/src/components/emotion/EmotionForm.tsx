import React, { useState, useCallback, useEffect } from "react";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

interface EmotionFormProps {
  onSubmit: (text: string, useRealModel: boolean) => void;
  loading: boolean;
  error: string | undefined;
}

export const EmotionForm: React.FC<EmotionFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Update character count immediately when text changes
  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(undefined);

      if (!text.trim()) {
        setLocalError("Please share your thoughts to analyze");
        return;
      }

      if (text.trim().length < 10) {
        setLocalError(
          "Please write at least 10 characters for better analysis"
        );
        return;
      }

      onSubmit(text.trim(), true);
    },
    [text, onSubmit]
  );

  // Handle text change immediately without debounce
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 1000) {
      setText(newText);
      setLocalError(undefined);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const currentError = localError ?? error;
  const isValid = text.trim().length >= 10;
  const canSubmit = isValid && !loading;

  // Get character count color based on usage
  const getCharCountColor = () => {
    if (charCount > 900) return "text-red-500 dark:text-red-400";
    if (charCount > 800) return "text-orange-500 dark:text-orange-400";
    if (charCount > 600) return "text-yellow-600 dark:text-yellow-500";
    return "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-950 border-b border-gray-100 dark:border-gray-600">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Share Your Feelings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
              Express what's on your mind, and discover deeper insights about
              your emotions
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced TextArea with improved styling */}
            <div className="relative">
              <TextArea
                label="How are you feeling?"
                placeholder="I'm feeling overwhelmed about my upcoming presentation. There's so much to prepare and I'm worried I might not do well..."
                value={text}
                onChange={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={currentError}
                rows={6}
                maxLength={1000}
                disabled={loading}
                className={`text-base transition-all duration-200 ${
                  isFocused
                    ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50 border-blue-300 dark:border-blue-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              {/* Character count with enhanced styling */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  {text.length >= 10 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      ✓ Ready to analyze
                    </span>
                  )}
                  {text.length > 0 && text.length < 10 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      {10 - text.length} more characters needed
                    </span>
                  )}
                </div>
                <span className={`text-sm font-medium ${getCharCountColor()}`}>
                  {charCount}/1000
                </span>
              </div>
            </div>

            {/* Enhanced submit button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                loading={loading}
                disabled={!canSubmit}
                className={`px-8 py-3 text-lg font-semibold transition-all duration-200 ${
                  canSubmit
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 shadow-lg hover:shadow-xl dark:hover:shadow-gray-700/50 transform hover:scale-105"
                    : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-gray-100"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing your emotions...
                  </span>
                ) : (
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Discover My Emotions
                  </span>
                )}
              </Button>
            </div>

            {/* Tips section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-400 dark:border-blue-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                💡 Tips for better analysis:
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                <li>• Be specific about what you're feeling and why</li>
                <li>• Include context about your situation</li>
                <li>• Mention any physical sensations you're experiencing</li>
                <li>
                  • Don't worry about grammar - focus on expressing yourself
                </li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
