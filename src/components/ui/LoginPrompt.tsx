"use client";

import { AnimatePresence, motion } from "motion/react";
import { LogIn } from "lucide-react";

export function LoginPrompt({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#161617] border border-[#5FA83D] text-[#F2F2EF] px-5 py-3 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        >
          <LogIn size={18} className="text-[#5FA83D] shrink-0" />
          <span className="text-sm font-bold uppercase tracking-wide">
            Please log in to add to your bag
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginPrompt;
