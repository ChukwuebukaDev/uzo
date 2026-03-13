"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow z-50">
      <div className="max-w-7xl mx-auto p-4 flex justify-between">
        <Link href="/" className="font-bold text-lg">
          Uzo
        </Link>

        <div className="flex gap-4">
          <button className="px-4 py-2 rounded bg-black text-white">
            Add Location
          </button>
        </div>
      </div>
    </header>
  );
}