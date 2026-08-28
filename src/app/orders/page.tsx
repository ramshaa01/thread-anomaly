import React from 'react';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default async function MyOrders() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  await connectDB();
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 text-[#F2F2EF]">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#161617] border border-[#333]">
          <Package size={48} className="mx-auto text-[#333] mb-4" />
          <p className="text-[#9A9A96] font-bold uppercase mb-6">No previous transmissions found.</p>
          <Link href="/shop" className="bg-[#F2F2EF] text-black font-black uppercase px-6 py-3 text-sm hover:bg-[#5FA83D] transition-colors">
            Explore The Grid
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id.toString()} className="bg-[#161617] border border-[#333] p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-[#222] pb-4 mb-4 gap-4">
                <div>
                  <p className="text-xs text-[#9A9A96] font-mono mb-1">ORDER #{order._id.toString()}</p>
                  <p className="text-sm font-bold text-[#F2F2EF]">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="text-right">
                    <p className="text-xs text-[#9A9A96] uppercase mb-1">Total</p>
                    <p className="text-sm font-bold text-[#F2C230]">₹{order.total}</p>
                  </div>
                  <div className="text-right">
                     <span className={`text-xs font-bold uppercase px-2 py-1 ${
                       order.status === 'PAID' ? 'bg-[#2E5E2A] text-white' : 
                       order.status === 'PENDING' ? 'bg-[#F2C230] text-black' : 'bg-[#333] text-[#F2F2EF]'
                     }`}>
                       {order.status}
                     </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id.toString()} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#0B0B0C] border border-[#222] overflow-hidden">
                      {item.image && !item.image.includes('placeholder') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-[#444]">[img]</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold uppercase text-[#F2F2EF] text-sm">{item.name}</h4>
                      <p className="text-[#9A9A96] text-xs uppercase">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#9A9A96] text-xs">Qty: {item.quantity}</p>
                      <p className="font-bold text-[#F2F2EF] text-sm">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
