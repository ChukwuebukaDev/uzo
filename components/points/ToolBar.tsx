"use client";

import { HiOutlineFunnel, HiOutlineMagnifyingGlass, HiOutlineChevronDown } from "react-icons/hi2";
import { motion } from "framer-motion";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  headers: string[];
  nameKey: string;
  setNameKey: (v: string) => void;
  onOpenFilter: () => void;
}

export default function Toolbar({
  search,
  setSearch,
  headers,
  nameKey,
  setNameKey,
  onOpenFilter,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <HiOutlineMagnifyingGlass
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500/70 pointer-events-none"
          size={18}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search points..."
          className="w-full pl-10 pr-4 py-2.5 sm:py-2
                    bg-white/60 backdrop-blur-md
                    ring-1 ring-white/50 focus:ring-2 focus:ring-emerald-400/40
                    rounded-xl text-sm text-gray-900 placeholder:text-gray-500/70
                    outline-none transition-all duration-200
                    shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        />
      </div>

      <div className="flex gap-2.5 sm:gap-3">
        {/* Name Key Select */}
        {headers.length > 0 && (
          <div className="relative flex-1 sm:flex-initial sm:min-w-">
            <select
              value={nameKey}
              onChange={(e) => setNameKey(e.target.value)}
              className="w-full appearance-none pl-4 pr-9 py-2.5 sm:py-2
                        bg-white/60 backdrop-blur-md
                        ring-1 ring-white/50 hover:ring-white/70 focus:ring-2 focus:ring-emerald-400/40
                        rounded-xl text-sm text-gray-700 font-medium
                        outline-none transition-all duration-200 cursor-pointer
                        shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              {headers.map((h) => (
                <option key={h} value={h} className="bg-white">
                  Name: {h}
                </option>
              ))}
            </select>
            <HiOutlineChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500/70 pointer-events-none"
              size={16}
            />
          </div>
        )}

        {/* Filter Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFilter}
          className="px-4 sm:px-5 py-2.5 sm:py-2
                    bg-gradient-to-br from-gray-800 to-gray-900
                    hover:from-gray-900 hover:to-black
                    text-white text-sm font-medium
                    rounded-xl
                    shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    ring-1 ring-gray-700/50
                    flex items-center gap-2
                    transition-all duration-200 shrink-0"
        >
          <HiOutlineFunnel size={16} />
          <span className="hidden sm:inline">Filter</span>
        </motion.button>
      </div>
    </div>
  );
}