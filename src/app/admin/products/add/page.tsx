import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#F2F2EF]">Add Product</h1>
      <ProductForm />
    </div>
  );
}
