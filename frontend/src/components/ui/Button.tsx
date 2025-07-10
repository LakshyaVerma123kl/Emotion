import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "gradient"
    | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  shadow?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  shadow = false,
  animated = true,
  children,
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
    disabled:opacity-50 disabled:cursor-not-allowed
    ${animated ? "transform hover:scale-105 active:scale-95" : ""}
    ${fullWidth ? "w-full" : ""}
    ${shadow ? "shadow-lg hover:shadow-xl dark:hover:shadow-gray-700/50" : ""}
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400
      ${shadow ? "shadow-blue-500/25 dark:shadow-blue-500/25" : ""}
    `,
    secondary: `
      bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 dark:focus:ring-gray-400
      ${shadow ? "shadow-gray-500/25 dark:shadow-gray-400/25" : ""}
    `,
    danger: `
      bg-red-600 dark:bg-red-500 text-white dark:text-gray-100 hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400
      ${shadow ? "shadow-red-500/25 dark:shadow-red-400/25" : ""}
    `,
    success: `
      bg-green-600 dark:bg-green-500 text-white dark:text-gray-100 hover:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500 dark:focus:ring-green-400
      ${shadow ? "shadow-green-500/25 dark:shadow-green-400/25" : ""}
    `,
    gradient: `
      bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white dark:text-gray-100
      hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:ring-blue-500 dark:focus:ring-blue-400
      ${shadow ? "shadow-blue-500/25 dark:shadow-blue-500/25" : ""}
    `,
    outline: `
      border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 
      hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500 dark:focus:ring-gray-400 bg-transparent
      ${shadow ? "shadow-gray-500/10 dark:shadow-gray-600/10" : ""}
    `,
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <LoadingSpinner
          size={size === "xs" || size === "sm" ? "sm" : "md"}
          className="mr-2"
          color="gray"
        />
      );
    }

    if (icon) {
      return (
        <span
          className={`${iconSizeClasses[size]} ${
            iconPosition === "left" ? "mr-2" : "ml-2"
          }`}
        >
          {icon}
        </span>
      );
    }

    return null;
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      <span className={loading ? "opacity-75" : ""}>{children}</span>
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};
