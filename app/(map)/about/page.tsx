"use client";

import { motion, type Variants } from "framer-motion";
import { MapPin, Route, Search, Layers, Sparkles } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w- h- bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 blur-3xl rounded-full opacity-50 dark:opacity-30" />
        <div className="absolute top-1/2 -right-40 w- h- bg-gradient-to-l from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full opacity-40 dark:opacity-20" />
      </div>

      {/* Container */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-20 sm:mb-28"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Location Intelligence, Reimagined</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Uzo
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A modern mapping and location intelligence platform designed to help you
            visualize, organize, and navigate your world effortlessly.
          </motion.p>
        </motion.section>

        {/* Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-10 sm:gap-16 mb-20 sm:mb-32 items-center"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
              Our Mission
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              Simplifying spatial data for everyone
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We simplify how people interact with geographic data. Whether you're planning routes,
              managing locations, or analyzing spatial patterns, Uzo gives you the tools to do it seamlessly —
              without the complexity.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
              <div className="text-6xl mb-4 opacity-20">"</div>
              <p className="text-lg sm:text-xl font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4">
                Maps are more than just directions — they're insights waiting to be discovered.
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
            </div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-20 sm:mb-32"
        >
          <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-4">
              Platform
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              What Uzo Offers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Smart Locations"
              description="Save, organize, and manage important places with intelligent tagging."
              accent="blue"
            />
            <FeatureCard
              icon={<Route className="w-6 h-6" />}
              title="Route Planning"
              description="Calculate efficient routes with real-time traffic and multi-stop optimization."
              accent="violet"
            />
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Instant Search"
              description="Find any location globally with predictive suggestions and filters."
              accent="purple"
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Map Layers"
              description="Visualize complex data with custom overlays and heatmaps."
              accent="cyan"
            />
          </div>
        </motion.section>

        {/* Vision */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-20 sm:mb-24 max-w-3xl mx-auto"
        >
          <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-4">
            Our Vision
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 tracking-tight">
            Location data for everyone
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We envision a future where location intelligence is intuitive, accessible, and powerful enough
            for everyone — from solo travelers to global enterprises. No PhD in GIS required.
          </p>
        </motion.section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} Uzo. Built with precision in Lagos.
          </p>
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
  accent = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "blue" | "violet" | "purple" | "cyan";
}) {
  const accentStyles = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 group-hover:shadow-blue-500/20",
    violet: "from-violet-500/20 to-violet-600/20 text-violet-600 dark:text-violet-400 group-hover:shadow-violet-500/20",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400 group-hover:shadow-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/20 text-cyan-600 dark:text-cyan-400 group-hover:shadow-cyan-500/20",
  };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-6 sm:p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${accentStyles[accent]} mb-4 transition-shadow duration-300 group-hover:shadow-lg`}>
        {icon}
      </div>

      <h3 className="font-bold text-lg mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}