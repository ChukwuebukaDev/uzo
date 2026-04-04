"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function DialogOverlay({
  open,
  onClose,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-999
        flex items-center justify-center
      "
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/40 backdrop-blur-sm
          animate-in fade-in
        "
      />
<button className="absolute top-3 bg-red-500 text-white rounded-4xl px-2 py-1 hover:bg-red-400 transition-colors duration-300 right-4" onClick={onClose}>
          close
        </button>
      {/* Dialog */}
      <div
        className="
          flex h-full justify-center items-center z-10
        "
      >
        {children}
      </div>
    </div>
  );
}