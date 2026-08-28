import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  // Convert ObjectIds to strings for passing to Client Component
  const productData = { ...product, _id: product._id.toString() };

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#F2F2EF]">Edit Product</h1>
      <ProductForm initialData={productData} />
    </div>
  );
}
