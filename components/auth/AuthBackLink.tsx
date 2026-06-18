"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

/** Client Component mínimo — solo el link animado del auth layout */
export function AuthBackLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute top-6 left-6 z-10"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 font-mono cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>kairo.home</span>
      </Link>
    </motion.div>
  );
}
