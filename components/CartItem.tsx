'use client'

import Image from 'next/image'
import { updateCartItem, removeCartItem } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CartItem({ item }: { item: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const image = item.variant?.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200';
  
  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    
    try {
      await updateCartItem(item.id, newQuantity);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemove = async () => {
    setLoading(true);
    
    try {
      await removeCartItem(item.id);
      toast.success('Item removed from cart');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
      
        
      
      
      
        {item.title}
        
          {item.variant?.title}
        
        
          ${item.unitPrice.toFixed(2)}
        
      
      
      
        
          Remove
        
        
        
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
            className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            -
          
          {item.quantity}
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={loading}
            className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            +
          
        
        
        
          ${item.total.toFixed(2)}
        
      
    
  )
}
