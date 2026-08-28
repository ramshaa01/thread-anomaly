"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        router.push("/shop");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161617] border border-[#333] p-8 relative overflow-hidden"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#00FF41]">Initialize Session</h1>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mb-6 text-sm font-bold uppercase">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Password</label>
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#00FF41] hover:text-[#FFEA00]">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" 
            />
          </div>

          <button type="submit" className="w-full bg-[#2E5E2A] text-white font-black uppercase py-4 hover:bg-[#5FA83D] transition-colors">
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold uppercase text-[#888]">
          No Access? <Link href="/register" className="text-[#00FF41] hover:text-[#FFEA00]">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
