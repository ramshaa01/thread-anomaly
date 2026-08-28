import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, ShoppingBag } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#161617] border-r border-[#333] flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <h2 className="text-[#F2F2EF] font-black uppercase tracking-tighter text-2xl">
            Admin <span className="text-[#5FA83D]">Panel</span>
          </h2>
          <p className="text-[#9A9A96] text-xs font-mono mt-1">Logged in as {admin.email}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 text-[#F2F2EF] hover:bg-[#333] p-3 rounded transition-colors font-bold uppercase text-sm">
            <LayoutDashboard size={18} className="text-[#5FA83D]" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 text-[#F2F2EF] hover:bg-[#333] p-3 rounded transition-colors font-bold uppercase text-sm">
            <Package size={18} className="text-[#F2C230]" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 text-[#F2F2EF] hover:bg-[#333] p-3 rounded transition-colors font-bold uppercase text-sm">
            <ShoppingBag size={18} className="text-[#F2F2EF]" /> Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-[#F2F2EF] hover:bg-[#333] p-3 rounded transition-colors font-bold uppercase text-sm">
            <Users size={18} className="text-[#9A9A96]" /> Users
          </Link>
        </nav>
        <div className="p-4 border-t border-[#333]">
           <Link href="/" className="text-[#9A9A96] hover:text-[#F2F2EF] text-xs font-bold uppercase tracking-wider block text-center border border-[#333] p-2">
            Exit to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
