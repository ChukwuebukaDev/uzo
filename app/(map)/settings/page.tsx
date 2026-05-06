"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Navigation, Map, Shield, WifiOff, Bell, Palette, 
  Settings2, LogOut, ChevronRight, Info, HardDrive
} from "lucide-react";

/**
 * PURE PREMIUM SETTINGS COMPONENT
 * Features: 
 * - Dynamic State Logic
 * - Framer Motion Animations
 * - iOS-accurate Blur & Translucency
 */
export default function Settings() {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30">
      {/* ⭐ Sticky iOS Header */}
      <header className="sticky top-8 z-30 backdrop-blur-md bg-black/50 border-b border-white/[0.08] px-6 pt-14 pb-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        </div>
      </header>

      {/* ⭐ Content Container */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-9 pb-32">
        
        <Section title="Account">
          <Item icon={<User size={20} />} label="Profile & Security" color="bg-blue-500" />
        </Section>

        <Section title="Navigation & Routing">
          <Item icon={<Navigation size={20} />} label="Route Preferences" color="bg-indigo-500" />
          <ToggleItem icon={<Navigation size={20} />} label="Avoid Tolls" color="bg-indigo-500" />
          <ToggleItem icon={<Navigation size={20} />} label="Avoid Highways" color="bg-indigo-500" />
          <ToggleItem icon={<Navigation size={20} />} label="Voice Guidance" color="bg-green-500" defaultOn />
        </Section>

        <Section title="Map & Display">
          <Item icon={<Map size={20} />} label="Map Style" value="Standard" color="bg-sky-500" />
          <ToggleItem icon={<Map size={20} />} label="Traffic Layer" color="bg-sky-500" defaultOn />
          <ToggleItem icon={<Map size={20} />} label="3D Buildings" color="bg-sky-500" defaultOn />
        </Section>

        <Section title="Offline & Data">
          <Item icon={<WifiOff size={20} />} label="Offline Maps" color="bg-orange-500" />
          <Item icon={<HardDrive size={20} />} label="Storage Usage" value="1.2 GB" color="bg-gray-500" />
        </Section>

        <Section title="System">
          <Item icon={<Settings2 size={20} />} label="About Uzo" color="bg-zinc-600" />
          <Item icon={<LogOut size={20} />} label="Log Out" danger />
        </Section>

      </main>
    </div>
  );
}

// --- Sub-components ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <h2 className="text-[13px] uppercase tracking-wider text-white/40 ml-4 font-medium">
        {title}
      </h2>
      <div className="bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/[0.05] rounded-2xl overflow-hidden">
        {children}
      </div>
    </motion.section>
  );
}

function Item({ 
  icon, label, value, danger, color = "bg-blue-500" 
}: { 
  icon: React.ReactNode; label: string; value?: string; danger?: boolean; color?: string 
}) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3.5 group active:bg-white/[0.08] transition-colors duration-150 border-b border-white/[0.05] last:border-none">
      <div className="flex items-center gap-3.5">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${danger ? 'bg-red-500/20' : color} shadow-inner`}>
          <div className={danger ? "text-red-500" : "text-white"}>{icon}</div>
        </div>
        <span className={`text-[17px] font-normal ${danger ? "text-red-500" : "text-white/90"}`}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {value && <span className="text-[17px] text-white/40">{value}</span>}
        <ChevronRight size={18} className="text-white/20 group-active:text-white/40" />
      </div>
    </button>
  );
}

function ToggleItem({ icon, label, color, defaultOn = false }: { icon: React.ReactNode; label: string; color: string; defaultOn?: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);

  return (
    <div 
      onClick={() => setIsOn(!isOn)}
      className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05] last:border-none cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${color} shadow-inner`}>
          <div className="text-white">{icon}</div>
        </div>
        <span className="text-[17px] font-normal text-white/90">{label}</span>
      </div>

      <div 
        className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-in-out ${
          isOn ? "bg-[#34c759]" : "bg-white/10"
        }`}
      >
        <motion.div 
          animate={{ x: isOn ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-[27px] h-[27px] bg-white rounded-full shadow-lg"
        />
      </div>
    </div>
  );
}