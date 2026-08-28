import React from 'react';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

export default async function AdminOrdersPage() {
  await connectDB();
  // Populate user to get email/name
  const orders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F2F2EF] mb-8">All Orders</h1>

      <div className="bg-[#161617] border border-[#333] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333] text-[#9A9A96] text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Order ID</th>
              <th className="p-4 font-bold">Customer</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Total</th>
              <th className="p-4 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id.toString()} className="border-b border-[#222] hover:bg-[#222] transition-colors">
                <td className="p-4">
                  <div className="font-mono text-xs text-[#F2F2EF]">{order._id.toString()}</div>
                  {order.razorpayPaymentId && (
                    <div className="text-[10px] text-[#9A9A96] font-mono mt-1">Pay: {order.razorpayPaymentId}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold text-[#F2F2EF] text-sm">
                    {order.user ? `${(order.user as any).firstName} ${(order.user as any).lastName}` : 'Guest'}
                  </div>
                  <div className="text-xs text-[#9A9A96]">{order.user ? (order.user as any).email : ''}</div>
                </td>
                <td className="p-4 text-sm text-[#9A9A96]">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="p-4 font-bold text-[#F2C230] text-sm">
                  ₹{order.total}
                </td>
                <td className="p-4 text-right">
                  <span className={`text-xs font-bold uppercase px-2 py-1 ${
                    order.status === 'PAID' ? 'bg-[#2E5E2A] text-white' : 
                    order.status === 'PENDING' ? 'bg-[#F2C230] text-black' : 'bg-[#333] text-[#F2F2EF]'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#9A9A96] uppercase text-sm font-bold">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
