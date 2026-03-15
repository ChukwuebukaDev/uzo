"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  color?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  color = "bg-blue-500",
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">

      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${color}`}
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-semibold text-gray-900">
          {value}
        </span>
      </div>
    </div>
  );
}