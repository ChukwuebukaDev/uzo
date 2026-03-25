
"use client";
import Hero from "@/components/layout/Hero";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Route, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    const hasSeenHero = localStorage.getItem("uzo_seen_hero");
    if (hasSeenHero) {
      setShowHero(false);
    } else {
      localStorage.setItem("uzo_seen_hero", "true");
    }
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b ">
      {showHero && <Hero />}
      <Features />
      <CTA />
    </main>
  );
}


function Features() {
  const features = [
    {
      icon: <MapPin size={28} />,
      title: "Smart POIs",
      desc: "Cluster and visualize points of interest with intelligent grouping.",
    },
    {
      icon: <Route size={28} />,
      title: "Route Optimization",
      desc: "Get the fastest and most efficient paths instantly.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Reliable Data",
      desc: "Accurate mapping powered by trusted routing systems.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Premium Experience",
      desc: "Smooth UI, elegant animations, and modern UX.",
    },
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        Why Choose Uzo?
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-indigo-500/50 transition"
          >
            <div className="mb-4 text-indigo-500">{f.icon}</div>
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-neutral-400 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold">Start Exploring Today</h2>
        <p className="mt-4 text-neutral-400">
          Build routes, manage locations, and unlock powerful mapping tools.
        </p>

        <Button className="mt-8 bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg rounded-2xl">
          Launch App
        </Button>
      </motion.div>
    </section>
  );
}
