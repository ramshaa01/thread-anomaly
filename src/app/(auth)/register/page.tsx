"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        router.push("/shop");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161617] border border-[#333] p-8 relative overflow-hidden"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#00FF41]">Join The Network</h1>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mb-6 text-sm font-bold uppercase">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">First Name</label>
              <input type="text" name="firstName" required onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Last Name</label>
              <input type="text" name="lastName" required onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Email</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Phone (Optional)</label>
              <input type="tel" name="phone" onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Password</label>
              <input type="password" name="password" required minLength={6} onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#888]">Confirm Password</label>
              <input type="password" name="confirmPassword" required minLength={6} onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] px-4 py-3 text-[#E5E5E5] focus:outline-none focus:border-[#00FF41] transition-colors font-mono text-sm" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#F2C230] text-black font-black uppercase py-4 hover:bg-white transition-colors mt-4">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold uppercase text-[#888]">
          Already Connected? <Link href="/login" className="text-[#00FF41] hover:text-[#FFEA00]">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
