"use client";

import {
  User,
  Navigation,
  Map,
  Shield,
  WifiOff,
  Bell,
  Palette,
  Settings2,
  LogOut,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-gray-900 via-black to-gray-950 text-white">

      {/* ⭐ Sticky Mobile Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/10 px-5 pt-safe pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm">
          Control your Uzo experience
        </p>
      </div>

      {/* ⭐ Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 pb-24">

        <Section title="Account">
          <Item icon={<User />} label="Profile & Security" />
        </Section>

        <Section title="Navigation & Routing">
          <Item icon={<Navigation />} label="Route Preferences" />
          <ToggleItem icon={<Navigation />} label="Avoid Tolls" />
          <ToggleItem icon={<Navigation />} label="Avoid Highways" />
          <ToggleItem icon={<Navigation />} label="Voice Guidance" />
        </Section>

        <Section title="Map & Display">
          <Item icon={<Map />} label="Map Style" value="Standard" />
          <ToggleItem icon={<Map />} label="Traffic Layer" defaultOn />
          <ToggleItem icon={<Map />} label="3D Buildings" defaultOn />
        </Section>

        <Section title="Privacy & Safety">
          <Item icon={<Shield />} label="Location Permissions" />
          <ToggleItem icon={<Shield />} label="Background Tracking" />
        </Section>

        <Section title="Offline & Data">
          <Item icon={<WifiOff />} label="Offline Maps" />
          <Item icon={<WifiOff />} label="Storage Usage" value="1.2 GB" />
        </Section>

        <Section title="Notifications">
          <ToggleItem icon={<Bell />} label="Traffic Alerts" defaultOn />
          <ToggleItem icon={<Bell />} label="Trip Updates" defaultOn />
        </Section>

        <Section title="Appearance">
          <Item icon={<Palette />} label="Theme" value="Dark" />
          <Item icon={<Palette />} label="Language" value="English" />
        </Section>

        <Section title="System">
          <Item icon={<Settings2 />} label="About Uzo" />
          <Item icon={<LogOut />} label="Log Out" danger />
        </Section>

      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-1">
        {title}
      </h2>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {children}
      </div>
    </section>
  );
}

function Item({
  icon,
  label,
  value,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-4 border-b border-white/10 last:border-none active:bg-white/10 transition ${
        danger ? "text-red-400 active:bg-red-500/10" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="opacity-80">{icon}</div>
        <span className="text-base font-medium">{label}</span>
      </div>

      {value && (
        <span className="text-sm text-gray-400">{value}</span>
      )}
    </button>
  );
}

function ToggleItem({
  icon,
  label,
  defaultOn,
}: {
  icon: React.ReactNode;
  label: string;
  defaultOn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 last:border-none">
      
      <div className="flex items-center gap-4">
        <div className="opacity-80">{icon}</div>
        <span className="text-base font-medium">{label}</span>
      </div>

      {/* Premium Toggle */}
      <div
        className={`w-12 h-7 rounded-full relative transition ${
          defaultOn ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition ${
            defaultOn ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );
}