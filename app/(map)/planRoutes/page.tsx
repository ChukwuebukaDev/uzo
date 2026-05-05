"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useMapStore, Point } from "@/stores/useMapStore";
import { getAddressString } from "@/utilities/navigateToPoint";
import { MapPin, User, FileText, X, Check, Navigation, Clock, TrendingUp, Award, Zap, ChevronRight, Menu } from "lucide-react";
import DialogOverlay from "@/components/ui/DialogOverlay";
import { mapProps } from "@/types/map";
import ZipUp from "@/utilities/AppZip";
import MapContainer from "@/components/map/MapContainer";
import { motion, AnimatePresence } from "framer-motion";

type User = { id: string; name: string; avatar?: string; role?: string };

export default function PlanRoute() {
  const points = useMapStore((s) => s.points);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [note, setNote] = useState("");
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);

  const mapProperties: mapProps = {
    zoom: 6,
    center: [9.0765, 7.3986],
    zoomControl: false,
    scrollWheelZoom: false,
    searchControl: true,
  };
  
  const users: User[] = [
    { id: "u1", name: "Alice Chen", role: "Senior Driver", avatar: "AC" },
    { id: "u2", name: "Bob Williams", role: "Delivery Expert", avatar: "BW" },
    { id: "u3", name: "Charlie Kim", role: "Route Specialist", avatar: "CK" },
    { id: "u4", name: "Diana Ross", role: "Logistics Lead", avatar: "DR" },
  ];

  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [optimized, setOptimized] = useState(false);

  // Resolve address for selected point
  useEffect(() => {
    if (!selectedPoint) return;
    setLoadingAddress(true);
    getAddressString(selectedPoint.lat, selectedPoint.lng).then((addr) => {
      setAddress(addr);
      setLoadingAddress(false);
    });
  }, [selectedPoint]);

  // Calculate metrics
  useEffect(() => {
    if (points.length > 0) {
      const distance = points.length * 2.5;
      setTotalDistance(distance);
      setEstimatedTime(distance * 2);
    }
  }, [points]);

  const handleAssign = useCallback(async () => {
    if (!selectedPoint || !assignedUser) return;
    
    setIsAssigning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    alert(`✓ Point "${selectedPoint.name}" assigned to ${assignedUser.name}`);
    
    setIsAssigning(false);
    setSelectedPoint(null);
    setNote("");
    setAssignedUser(null);
  }, [selectedPoint, assignedUser]);

  const handleOptimizeRoute = useCallback(() => {
    setOptimized(true);
    setTimeout(() => {
      alert("Route optimized! 🎯");
    }, 500);
  }, []);

  // Desktop-only stats
  const desktopStats = useMemo(() => [
    { label: "Total Points", value: points.length, icon: MapPin, color: "from-blue-500 to-cyan-500" },
    { label: "Total Distance", value: `${totalDistance.toFixed(1)} km`, icon: Navigation, color: "from-green-500 to-emerald-500" },
    { label: "Est. Time", value: `${Math.floor(estimatedTime / 60)}h ${estimatedTime % 60}m`, icon: Clock, color: "from-orange-500 to-red-500" },
    { label: "Efficiency", value: optimized ? "94%" : "76%", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  ], [points.length, totalDistance, estimatedTime, optimized]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 pb-20 lg:pb-0">
      
      {/* Animated Background Elements - Desktop only for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Back Button - Mobile optimized */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.history.back()}
        className="fixed left-3 top-20 z-40 lg:left-4 lg:top-24 flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5
                   bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl
                   rounded-xl lg:rounded-2xl shadow-lg
                   border border-white/20 dark:border-neutral-700/30
                   transition-all duration-300 text-xs lg:text-sm font-medium
                   text-gray-700 dark:text-gray-200 active:scale-95"
      >
        <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 rotate-180" />
        <span className="hidden sm:inline">Back</span>
      </motion.button>

      {/* Desktop Stats Cards - Hidden on mobile */}
      <div className="fixed top-24 right-4 z-50 flex-col gap-3 hidden lg:flex">
        {desktopStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 rounded-2xl`} />
            <div className="relative w-52 p-3 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-3.5 h-3.5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* Optimize Button - Desktop only */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOptimizeRoute}
          className="group relative overflow-hidden w-52"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90 rounded-2xl" />
          <div className="relative px-3 py-3 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Optimize Route</span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Stats Bar - Compact and swipeable */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 px-3">
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-neutral-700/30 shadow-lg">
          <button
            onClick={() => setShowMobileStats(!showMobileStats)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Route Stats
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-gray-400">{points.length} stops</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-gray-600 dark:text-gray-400">{totalDistance.toFixed(1)} km</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${showMobileStats ? 'rotate-90' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {showMobileStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/20 dark:border-neutral-700/30"
              >
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Distance</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{totalDistance.toFixed(1)} km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Time</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Efficiency</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{optimized ? "94%" : "76%"}</p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleOptimizeRoute}
                      className="w-full text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1.5 rounded-lg font-medium"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto p-3 pt-28 lg:p-6 lg:pt-32">
        
        {/* Header Section - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 lg:mb-8 px-1"
        >
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Plan Route
          </h1>
          <p className="text-xs lg:text-base text-gray-600 dark:text-gray-400 mt-1 lg:mt-2">
            Organize stops and assign deliveries
          </p>
        </motion.div>

        {/* Points List & Assign Panel */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
          {/* Points List - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
              <div className="p-3 lg:p-4 border-b border-white/20 dark:border-neutral-700/30">
                <h2 className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                  Stops ({points.length})
                </h2>
              </div>
              
              <div className="max-h-[50vh] overflow-y-auto divide-y divide-white/10 dark:divide-neutral-700/20">
                <AnimatePresence>
                  {points.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 lg:p-8 text-center"
                    >
                      <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                        <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                      </div>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        No points available
                      </p>
                    </motion.div>
                  ) : (
                    points.map((p, index) => (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedPoint(p)}
                        className="w-full text-left p-3 lg:p-4 hover:bg-white/20 dark:hover:bg-neutral-800/30 transition-all duration-300 active:bg-white/30 dark:active:bg-neutral-800/40"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 lg:gap-2 mb-1">
                              <span className="text-xs font-mono bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1.5 py-0.5 lg:px-2 rounded-full">
                                #{index + 1}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base truncate">
                                {p.name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                              {p.category}
                            </p>
                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-500 font-mono truncate">
                              {`${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Desktop Assign Panel - Hidden on mobile */}
          <AnimatePresence>
            {selectedPoint && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden lg:block flex-1 sticky top-32"
              >
                <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-5 border-b border-white/20 dark:border-neutral-700/30">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Assign Stop
                      </h2>
                      <button
                        onClick={() => setSelectedPoint(null)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {selectedPoint.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {loadingAddress ? "Loading..." : address || "Unknown location"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add delivery instructions..."
                        rows={3}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-neutral-700
                                 bg-white/50 dark:bg-neutral-800/50 text-gray-900 dark:text-white
                                 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assign to
                      </label>
                      <div className="space-y-2">
                        {users.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => setAssignedUser(user)}
                            className={`w-full p-3 rounded-xl transition-all duration-200 text-left flex items-center gap-3
                              ${assignedUser?.id === user.id
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30"
                                : "bg-white/30 dark:bg-neutral-800/30 border border-white/20 dark:border-neutral-700/30"
                              }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.avatar}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.role}
                              </p>
                            </div>
                            {assignedUser?.id === user.id && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleAssign}
                        disabled={!assignedUser || isAssigning}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50"
                      >
                        {isAssigning ? "Assigning..." : "Assign"}
                      </button>
                      <button
                        onClick={() => setSelectedPoint(null)}
                        className="flex-1 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Preview - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-8"
        >
          <div className="relative rounded-xl lg:rounded-2xl overflow-hidden bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 shadow-lg">
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 z-10 px-2 py-1 lg:px-3 lg:py-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-lg text-[10px] lg:text-xs font-semibold text-gray-700 dark:text-gray-300">
              Route Preview
            </div>
            <div className="h-64 lg:h-96">
              <MapContainer properties={mapProperties} />
            </div>
          </div>
        </motion.div>

        {/* Pro Tips - Hidden on mobile to save space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-xl lg:rounded-2xl hidden lg:flex"
        >
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Pro Tips
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Cluster nearby stops to reduce travel time • Assign points based on driver expertise
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Sheet for Assignment */}
      <AnimatePresence>
        {selectedPoint && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPoint(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedPoint.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {loadingAddress ? "Loading..." : address || "Unknown location"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Notes
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add delivery instructions..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-neutral-700
                             bg-white/50 dark:bg-neutral-800/50 text-gray-900 dark:text-white
                             resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Assign to
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setAssignedUser(user)}
                        className={`w-full p-3 rounded-xl transition-all duration-200 text-left flex items-center gap-3
                          ${assignedUser?.id === user.id
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30"
                            : "bg-white/30 dark:bg-neutral-800/30 border border-white/20 dark:border-neutral-700/30"
                          }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.role}
                          </p>
                        </div>
                        {assignedUser?.id === user.id && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAssign}
                    disabled={!assignedUser || isAssigning}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    {isAssigning ? "Assigning..." : "Assign Point"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ZipUp>
        <div className="hidden">Map container wrapper</div>
      </ZipUp>
    </div>
  );
}