'use client'

import { addToCart } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      await addToCart(variantId, 1);
      toast.success('Added to cart!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
      {loading ? 'Adding...' : 'Add to Cart'}
    
  )
}