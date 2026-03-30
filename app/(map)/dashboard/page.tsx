'use client';
import { Bell, User, Menu, Map, Layers, Navigation } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed md:static z-20 top-0 left-0 h-full w-64 bg-white shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition`}>
        <nav className="p-4 space-y-3">
          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <Map size={18} /> Map Overview
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <Navigation size={18} /> Route Planner
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <Layers size={18} /> Layers & POIs
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Activity Logs
          </div>
        </nav>
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)}>
              <Menu />
            </button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="cursor-pointer" />
            <User className="cursor-pointer" />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-gray-500">Tracked Locations</h2>
              <p className="text-2xl font-bold mt-2">128</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-gray-500">Active Routes</h2>
              <p className="text-2xl font-bold mt-2">42</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-gray-500">POIs</h2>
              <p className="text-2xl font-bold mt-2">560</p>
            </div>
          </div>

          {/* Map + Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map View */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4 h-100 flex items-center justify-center text-gray-400">
              {/* Replace this with your Leaflet / Map component */}
              Map View (Leaflet goes here)
            </div>

            {/* Activity Logs */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
              <h2 className="text-lg font-bold mb-4">Activity Logs</h2>

              <div className="space-y-3 overflow-y-auto">
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
                  <span>New marker added</span>
                  <span className="text-sm text-gray-400">2m ago</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
                  <span>Route calculated</span>
                  <span className="text-sm text-gray-400">10m ago</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
                  <span>Layer toggled</span>
                  <span className="text-sm text-gray-400">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}