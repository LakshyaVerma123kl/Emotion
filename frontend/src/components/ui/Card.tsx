import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "gradient" | "bordered" | "glass";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  hover = false,
  animated = true,
}) => {
  const baseClasses = `
    rounded-lg transition-all duration-200
    ${animated ? "transform" : ""}
    ${
      hover
        ? "hover:scale-105 hover:shadow-lg dark:hover:shadow-gray-700/50"
        : ""
    }
  `;

  const variantClasses = {
    default:
      "bg-gray-50 dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600",
    elevated: "bg-gray-50 dark:bg-gray-800 shadow-xl border-0",
    gradient:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0",
    bordered:
      "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-sm",
    glass:
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "accent";
  size?: "sm" | "md" | "lg";
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
}) => {
  const baseClasses = "border-b border-gray-200 dark:border-gray-600";

  const variantClasses = {
    default: "bg-gray-50 dark:bg-gray-800",
    gradient:
      "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-950",
    accent:
      "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-950",
  };

  const sizeClasses = {
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  return (
    <div
      className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  return <div className={`${sizeClasses[size]} ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "bordered";
  size?: "sm" | "md" | "lg";
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
}) => {
  const baseClasses = "border-t border-gray-200 dark:border-gray-600";

  const variantClasses = {
    default: "bg-gray-50 dark:bg-gray-800",
    gradient:
      "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
    bordered: "bg-gray-50 dark:bg-gray-800",
  };

  const sizeClasses = {
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  return (
    <div
      className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
    </div>
  );
};
