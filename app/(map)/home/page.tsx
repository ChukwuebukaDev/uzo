"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MapHeader from "@/components/map/UI/MapHeader";
import { useMapStore } from "@/stores/useMapStore";
import { 
  Satellite, Activity, Globe, Zap, Radio, Layers, 
  Navigation, Shield, Cpu, Map as MapIcon, 
  Wind, Droplets, Gauge, Terminal, ChevronRight
} from "lucide-react";

export default function UzoDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userLocation = useMapStore((s) => s.userLocation) || { lat: 6.5244, lng: 3.3792 };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.lng}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY}`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchWeather();
  }, [userLocation.lat, userLocation.lng]);

  return (
    <div className="min-h-screen transition-colors duration-700 bg-slate-50 dark:bg-[#000] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. Global Navigation Layer */}
      <div className="relative z-[100]">
        <MapHeader />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        
        {/* 2. Intelligence Sidebar */}
        <aside className="lg:w-72 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 border-r border-slate-200 dark:border-white/[0.08] bg-white/40 dark:bg-black/40 backdrop-blur-2xl hidden lg:flex flex-col">
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Terminal size={16} className="text-white" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase">Geospatial_OS</span>
            </div>
            
            <nav className="space-y-1">
              <SideNavItem icon={<Globe />} label="Global Console" active />
              <SideNavItem icon={<Activity />} label="Real-time Feed" />
              <SideNavItem icon={<Layers />} label="Vector Layers" />
              <SideNavItem icon={<Shield />} label="Encryption" />
            </nav>
          </div>

          <div className="mt-auto p-6">
             <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4">
               <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">System Health</p>
               <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} className="h-full bg-indigo-500" />
               </div>
             </div>
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-1 p-4 lg:p-10 space-y-8 max-w-[1600px] mx-auto w-full">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight italic">Operations Overview</h2>
              <div className="flex items-center gap-2 text-slate-500 dark:text-white/30 text-[10px] font-mono mt-1">
                <span className="text-emerald-600 dark:text-emerald-500 uppercase font-bold tracking-tighter">● Online</span>
                <span>/</span>
                <span>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm rounded-full px-4 py-2 flex items-center gap-4 font-mono text-[11px]">
              <span className="text-slate-400 dark:text-white/40 italic">Sync:</span>
              <span className="text-indigo-600 dark:text-indigo-400">{currentTime.toLocaleTimeString([], { hour12: false })}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TelemetryCard icon={<Satellite />} label="Sats" value="24" color="text-blue-500" />
                <TelemetryCard icon={<Activity />} label="Seismic" value="0.8" color="text-emerald-500" />
                <TelemetryCard icon={<Radio />} label="Ping" value="18ms" color="text-amber-500" />
                <TelemetryCard icon={<Zap />} label="Ionosphere" value="Low" color="text-purple-500" />
              </div>

              {/* Theme Responsive Weather Card */}
              <section className="bg-white dark:bg-gradient-to-br dark:from-indigo-950/30 dark:to-black border border-slate-200 dark:border-white/[0.1] shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[32px] p-8 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe size={300} className="animate-spin-slow text-slate-900 dark:text-white" />
                </div>
                
                {loading ? (
                  <div className="h-48 flex items-center justify-center font-mono text-slate-300 dark:text-white/20 animate-pulse">Syncing...</div>
                ) : (
                  <div className="relative z-10 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase italic">Environment Matrix</p>
                      <div>
                        <h3 className="text-7xl font-light tracking-tighter leading-none">{Math.round(weatherData?.main.temp)}°</h3>
                        <p className="text-xl text-slate-500 dark:text-white/60 capitalize mt-2 font-medium">{weatherData?.weather[0].description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-l border-slate-100 dark:border-white/[0.05] pl-8">
                      <WeatherStat label="Wind" value={`${weatherData?.wind.speed} m/s`} icon={<Wind size={14}/>} />
                      <WeatherStat label="Humidity" value={`${weatherData?.main.humidity}%`} icon={<Droplets size={14}/>} />
                      <WeatherStat label="Pressure" value={`${weatherData?.main.pressure} hPa`} icon={<Gauge size={14}/>} />
                      <WeatherStat label="Visibility" value="10 km" icon={<Globe size={14}/>} />
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] shadow-lg rounded-[32px] p-6 space-y-6">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] px-2">Deployment Controls</h3>
                <div className="space-y-1">
                  <ControlItem icon={<Navigation />} label="Vector Pathing" value="Optimal" color="bg-indigo-600" />
                  <ControlItem icon={<Shield />} label="Spatial Mask" value="Active" color="bg-emerald-600" />
                  <ControlItem icon={<Cpu />} label="Kernel Accel" value="Enabled" color="bg-slate-700" />
                  <ControlItem icon={<MapIcon />} label="Lidar Render" value="Beta_2.1" color="bg-orange-600" />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Dynamic Sub-Components ---

function SideNavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
      {React.cloneElement(icon, { size: 18 })}
      <span className="text-sm font-medium tracking-tight">{label}</span>
    </div>
  );
}

function TelemetryCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none p-5 rounded-[28px] hover:scale-[1.02] transition-all">
      <div className={`mb-3 ${color}`}>{React.cloneElement(icon, { size: 18 })}</div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function WeatherStat({ label, value, icon }: any) {
  return (
    <div className="space-y-1 py-1">
      <div className="text-slate-300 dark:text-white/20">{icon}</div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function ControlItem({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} shadow-sm`}>
          {React.cloneElement(icon, { size: 16, className: "text-white" })}
        </div>
        <span className="text-[13px] font-medium opacity-80">{label}</span>
      </div>
      <span className="text-[10px] font-mono opacity-30 italic">{value}</span>
    </div>
  );
}