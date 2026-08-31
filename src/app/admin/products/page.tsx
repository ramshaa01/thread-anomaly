import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { Edit, Plus } from 'lucide-react';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function AdminProducts() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F2F2EF]">Products</h1>
        <Link href="/admin/products/add" className="bg-[#5FA83D] text-black font-bold uppercase px-4 py-2 flex items-center gap-2 hover:bg-[#F2C230] transition-colors text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-[#161617] border border-[#333] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333] text-[#9A9A96] text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Image</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id.toString()} className="border-b border-[#222] hover:bg-[#222] transition-colors group">
                <td className="p-4">
                  <div className="w-12 h-12 bg-[#0B0B0C] border border-[#333] flex items-center justify-center overflow-hidden">
                    {product.images?.[0] && !product.images[0].includes('placeholder') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#333] text-[10px] font-mono">img</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-[#F2F2EF] uppercase text-sm">{product.name}</div>
                  <div className="text-xs text-[#9A9A96] font-mono">{product.slug}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {product.salePrice ? (
                      <span className="text-[#F2C230] font-bold">₹{product.salePrice}</span>
                    ) : (
                      <span className="text-[#F2F2EF]">₹{product.price}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-mono ${product.stock < 10 ? 'text-red-500' : 'text-[#9A9A96]'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-[#333] text-[#F2F2EF] text-[10px] uppercase px-2 py-1 font-bold">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/products/${product._id}/edit`} className="text-[#F2C230] hover:text-white transition-colors">
                      <Edit size={18} />
                    </Link>
                    <DeleteProductButton productId={product._id.toString()} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#9A9A96] uppercase text-sm font-bold">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
