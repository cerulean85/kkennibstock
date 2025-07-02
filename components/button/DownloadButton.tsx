import React from "react";

interface DownloadButtonProps {
  href: string;
  filename?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  href,
  filename,
  size = "md",
  variant = "primary",
  disabled = false,
  children,
  className = "",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabledClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <a
      href={href}
      download={filename}
      className={baseClasses}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={disabled}
    >
      {children && children !== "Download" ? (
        children
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {children || "Download"}
        </>
      )}
    </a>
  );
};

export default DownloadButton;
