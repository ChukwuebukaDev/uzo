"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CurtainLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("uzoIntroShown");

    if (!alreadyShown) {
      
      setTimeout(()=>setShow(true),0)
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("uzoIntroShown", "true");
      }, 3200);
    }
  }, []);

  return (
    <>
    
      {children}

      {/* Loader OVERLAY */}
      {show && (
        <div className="fixed inset-0 z-9999 bg-black flex items-center justify-center overflow-hidden pointer-events-none">

          {/* Spinner */}
          <motion.div
            className="absolute w-14 h-14 border-4 border-gray-500 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          {/* Left Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ delay: 2, duration: 1.2, ease: "easeInOut" }}
            className="absolute left-0 top-0 h-full w-1/2 bg-black"
          />

          {/* Right Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ delay: 2, duration: 1.2, ease: "easeInOut" }}
            className="absolute right-0 top-0 h-full w-1/2 bg-black"
          />
        </div>
      )}
    </>
  );
}