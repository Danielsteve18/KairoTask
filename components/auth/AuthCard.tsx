"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthCardProps {
  eyebrow: string;          // e.g. "> kairo.auth.login"
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Card */}
      <div className="w-full rounded-2xl border border-white/[0.08] p-8 bg-[#09090B]">
        {/* Eyebrow técnico */}
        <p className="font-mono text-xs text-[#22C55E] mb-6 tracking-wide">
          {eyebrow}
        </p>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-[#F8FAFC] mb-2 tracking-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Form slot */}
        {children}

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-sm text-[#94A3B8]">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="text-[#F8FAFC] font-medium hover:text-[#22C55E] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
