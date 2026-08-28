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

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-16 h-16 bg-[#00FF41] text-black flex items-center justify-center rounded-full mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#00FF41] mb-2">Message Received</h2>
                <p className="text-[#888] font-medium">We will process your transmission shortly.</p>
                <button onClick={() => setStatus("idle")} className="mt-8 text-sm font-bold uppercase tracking-wider text-[#E5E5E5] hover:text-[#00FF41] underline underline-offset-4 decoration-[#333] hover:decoration-[#00FF41] transition-all">
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Identifier / Name</label>
                    <input type="text" required className="w-full bg-black border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Return Channel / Email</label>
                    <input type="email" required className="w-full bg-black border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Subject / Frequency</label>
                  <select required className="w-full bg-black border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm appearance-none cursor-pointer">
                    <option value="">Select an option</option>
                    <option value="order">Order Inquiry</option>
                    <option value="collab">Collaboration</option>
                    <option value="press">Press / Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Transmission / Message</label>
                  <textarea required rows={6} className="w-full bg-black border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm resize-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full bg-white text-black font-black uppercase py-4 hover:bg-[#00FF41] transition-colors disabled:opacity-50"
                >
                  {status === "submitting" ? "Transmitting..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
