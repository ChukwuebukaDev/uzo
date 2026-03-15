"use client";

import React from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "glass";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md",

    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200",

    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-800",

    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-md",

    glass:
      "bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl hover:bg-white/90",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}

      {children}
    </button>
  );
}