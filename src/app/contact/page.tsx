"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-5/12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6"
          >
            Establish <br/><span className="text-[#00FF41]">Connection</span>
          </motion.h1>
          <p className="text-[#888] font-medium leading-relaxed mb-12">
            Questions about a drop? Collab inquiries? Or just want to send us a track? Open a channel below.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[#FFEA00] mb-2 text-sm">Direct Line</h3>
              <p className="text-[#E5E5E5] font-mono">transmission@threadanomaly.com</p>
            </div>
            
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[#FFEA00] mb-2 text-sm">HQ (No walk-ins)</h3>
              <p className="text-[#E5E5E5] font-mono leading-relaxed">
                Sector 4, Underground Level B<br/>
                Industrial District<br/>
                Mumbai 400013
              </p>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-[#FFEA00] mb-4 text-sm">Social Frequencies</h3>
              <div className="flex gap-6 font-bold uppercase tracking-wider">
                <a href="#" className="hover:text-[#00FF41] border-b border-transparent hover:border-[#00FF41] pb-1 transition-all">Instagram</a>
                <a href="#" className="hover:text-[#00FF41] border-b border-transparent hover:border-[#00FF41] pb-1 transition-all">YouTube</a>
                <a href="#" className="hover:text-[#00FF41] border-b border-transparent hover:border-[#00FF41] pb-1 transition-all">Twitter</a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-7/12">
          <div className="bg-[#111] border border-[#333] p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 border border-[#333] rounded-full opacity-20 pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-48 h-48 border border-[#333] rounded-full opacity-20 pointer-events-none"></div>

            <div className="relative z-10 py-12 text-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#F2F2EF] mb-4">Initialize Transmission</h2>
              <p className="text-[#888] font-medium mb-8">
                All communications are currently being routed through direct email channels. 
                Click below to open a secure line.
              </p>
              <a 
                href="mailto:transmission@threadanomaly.com"
                className="inline-block w-full bg-white text-black font-black uppercase py-4 hover:bg-[#00FF41] transition-colors"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
