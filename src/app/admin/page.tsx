import React from 'react';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

export default async function AdminDashboard() {
  await connectDB();
  
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  
  const paidOrders = await Order.find({ status: 'PAID' });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#F2F2EF]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-[#161617] border border-[#222] p-6 relative overflow-hidden group hover:border-[#5FA83D] transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5FA83D] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
          <h3 className="text-[#9A9A96] text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-black text-[#F2F2EF]">₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-[#161617] border border-[#222] p-6 relative overflow-hidden group hover:border-[#F2C230] transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F2C230] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
          <h3 className="text-[#9A9A96] text-sm font-bold uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-black text-[#F2F2EF]">{totalOrders}</p>
        </div>
        
        <div className="bg-[#161617] border border-[#222] p-6 relative overflow-hidden group hover:border-white transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity"></div>
          <h3 className="text-[#9A9A96] text-sm font-bold uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-3xl font-black text-[#F2F2EF]">{totalProducts}</p>
        </div>
        
        <div className="bg-[#161617] border border-[#222] p-6 relative overflow-hidden group hover:border-[#9A9A96] transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#9A9A96] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
          <h3 className="text-[#9A9A96] text-sm font-bold uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-3xl font-black text-[#F2F2EF]">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
