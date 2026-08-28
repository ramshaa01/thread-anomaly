"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Graphic Tees',
    price: initialData?.price || '',
    salePrice: initialData?.salePrice || '',
    description: initialData?.description || '',
    stock: initialData?.stock || 0,
    sizes: initialData?.sizes?.join(', ') || 'S, M, L, XL',
    colors: initialData?.colors?.join(', ') || 'Black',
    images: initialData?.images?.join(', ') || '/images/placeholder.svg',
    isNew: initialData?.isNew || false,
    isBestSeller: initialData?.isBestSeller || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    
    // Auto-generate slug from name if creating new
    if (name === 'name' && !initialData) {
      setFormData((prev) => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        sizes: formData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c: string) => c.trim()).filter(Boolean),
        images: formData.images.split(',').map((i: string) => i.trim()).filter(Boolean),
      };

      const url = initialData ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#161617] border border-[#333] p-8 max-w-3xl">
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Product Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Slug</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none font-mono text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none">
            <option>Graphic Tees</option>
            <option>Oversized Fits</option>
            <option>Limited Drops</option>
            <option>Music Collab Series</option>
          </select>
        </div>
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Price (₹)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Sale Price (₹)</label>
          <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} min="0" className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none resize-none"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Sizes (comma separated)</label>
          <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} required className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Colors (comma separated)</label>
          <input type="text" name="colors" value={formData.colors} onChange={handleChange} required className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Image URLs (comma separated)</label>
          <input type="text" name="images" value={formData.images} onChange={handleChange} required className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none font-mono text-sm" placeholder="URL or /images/placeholder.svg" />
        </div>
        <div>
          <label className="block text-[#9A9A96] text-xs font-bold uppercase mb-2">Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full bg-[#0B0B0C] border border-[#333] p-3 text-[#F2F2EF] focus:border-[#5FA83D] outline-none" />
        </div>
      </div>

      <div className="flex gap-6 pt-4 border-t border-[#333]">
        <label className="flex items-center gap-2 cursor-pointer text-[#F2F2EF] text-sm font-bold uppercase">
          <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 accent-[#5FA83D]" />
          New Arrival
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[#F2F2EF] text-sm font-bold uppercase">
          <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-4 h-4 accent-[#F2C230]" />
          Best Seller
        </label>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={loading} className="bg-[#5FA83D] text-black font-black uppercase px-8 py-4 hover:bg-[#F2C230] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}
