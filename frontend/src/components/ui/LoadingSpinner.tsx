import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "pulse" | "dots" | "bars";
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  color = "blue",
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-600 dark:border-blue-400",
    green: "border-green-600 dark:border-green-400",
    red: "border-red-600 dark:border-red-400",
    yellow: "border-yellow-600 dark:border-yellow-400",
    purple: "border-purple-600 dark:border-purple-400",
    gray: "border-gray-600 dark:border-gray-400",
  };

  if (variant === "default") {
    return (
      <div
        className={`
          animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600
          ${colorClasses[color]} ${sizeClasses[size]} ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        style={{ borderTopColor: "currentColor" }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div
        className={`
          animate-spin rounded-full border-2 border-transparent
          bg-gradient-to-r from-${color}-400 to-${color}-600 dark:from-${color}-500 dark:to-${color}-700
          ${sizeClasses[size]} ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        style={{
          background: `conic-gradient(from 0deg, transparent, currentColor)`,
          borderRadius: "50%",
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              bg-${color}-600 dark:bg-${color}-400 rounded-full animate-pulse
              ${sizeClasses[size]}
            `
              .replace(/\s+/g, " ")
              .trim()}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s",
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              bg-${color}-600 dark:bg-${color}-400 rounded-full animate-bounce
              ${sizeClasses[size]}
            `
              .replace(/\s+/g, " ")
              .trim()}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              bg-${color}-600 dark:bg-${color}-400 animate-pulse
              ${size === "xs" ? "w-1 h-3" : ""}
              ${size === "sm" ? "w-1 h-4" : ""}
              ${size === "md" ? "w-1 h-6" : ""}
              ${size === "lg" ? "w-1.5 h-8" : ""}
              ${size === "xl" ? "w-2 h-12" : ""}
            `
              .replace(/\s+/g, " ")
              .trim()}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "1.2s",
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
};
