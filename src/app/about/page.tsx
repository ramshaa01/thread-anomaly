"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
        <div className="lg:w-1/2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-[#E5E5E5]"
          >
            Break <br/> The <span className="text-[#00FF41]">Grid</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#888] font-medium leading-relaxed space-y-6 max-w-lg"
          >
            <p>
              Thread Anomaly started in 2024 as a reaction against the sterile, hyper-minimalist aesthetic taking over streetwear. We didn't want another cream-colored hoodie with a tiny serif logo. 
            </p>
            <p>
              We wanted noise. We wanted static. We wanted clothes that looked like a corrupted save file, designed for the late-night underground, the music culture, the people who don't fit the pattern.
            </p>
          </motion.div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="aspect-[4/3] bg-[#111] border border-[#333] relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[#444] group-hover:text-[#00FF41] transition-colors">/studio_feed_corrupted.mp4</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 border-t border-[#222] pt-24">
        <div>
          <h3 className="text-xl font-black uppercase text-[#00FF41] mb-4 tracking-tighter">01. Originality</h3>
          <p className="text-[#888] text-sm leading-relaxed">No stock vectors. No stolen art. Every graphic is conceptualized and built in-house, often born from actual digital errors and analog feedback loops.</p>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase text-[#FFEA00] mb-4 tracking-tighter">02. Music-Driven</h3>
          <p className="text-[#888] text-sm leading-relaxed">Our roots are in the underground electronic scene. The BPM dictates the design. The clothes are made to withstand the pit and the afterparty.</p>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase text-[#E5E5E5] mb-4 tracking-tighter">03. Bold Identity</h3>
          <p className="text-[#888] text-sm leading-relaxed">Loud prints, heavy fabrics, and fits that don't apologize. We design for visibility. If you want to blend in, shop elsewhere.</p>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase text-[#E5E5E5] mb-4 tracking-tighter">04. Community</h3>
          <p className="text-[#888] text-sm leading-relaxed">Thread Anomaly isn't just a label, it's a frequency. We collaborate with DJs, producers, and local artists to push the culture forward.</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#333] p-12 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Join The Network</h2>
        <p className="text-[#888] max-w-md mx-auto mb-8 font-medium">Get early access to limited drops, unreleased tracks from our collaborators, and studio updates.</p>
        <Link href="/contact" className="inline-block bg-[#00FF41] text-black font-black uppercase px-8 py-4 tracking-wider hover:bg-white transition-colors">
          Initialize Contact
        </Link>
      </div>
    </div>
  );
}
