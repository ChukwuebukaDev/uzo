"use client";

import { motion } from "framer-motion";
import { MapPin, Route, Search, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-800 dark:text-white">
      
      {/* Container */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-6xl mx-auto">

        {/* Hero */}
        <section className="text-center mb-14 sm:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          >
            About Uzo
          </motion.h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Uzo is a modern mapping and location intelligence platform designed
            to help you visualize, organize, and navigate your world effortlessly.
          </p>
        </section>

        {/* Mission */}
        <section className="flex flex-col md:grid md:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-24">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
              We simplify how people interact with geographic data. Whether
              you&apos;re planning routes, managing locations, or analyzing spatial
              data, Uzo gives you the tools to do it seamlessly.
            </p>
          </div>

          <div className="bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 sm:p-6 shadow-md">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              “Maps are more than just directions — they&apos;re insights waiting to be discovered.”
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12">
            What Uzo Offers
          </h2>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard
              icon={<MapPin />}
              title="Smart Locations"
              description="Save and manage important places easily."
            />

            <FeatureCard
              icon={<Route />}
              title="Route Planning"
              description="Plan efficient routes between points."
            />

            <FeatureCard
              icon={<Search />}
              title="Search"
              description="Find locations instantly with suggestions."
            />

            <FeatureCard
              icon={<Layers />}
              title="Map Layers"
              description="Visualize data with overlays."
            />
          </div>
        </section>

        {/* Vision */}
        <section className="text-center mb-16 sm:mb-24">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            Our Vision
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We envision a future where location data is intuitive,
            accessible, and powerful enough for everyone—from individuals to enterprises.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Uzo. Built with precision.
        </footer>

      </div>
    </div>
  );
}

/* Feature Card */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition active:scale-[0.98]">
      
      <div className="mb-3 text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="font-semibold text-base sm:text-lg mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}