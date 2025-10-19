'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    paymentMethod: 'stripe'
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get cart ID from cookies (in real app, this would be handled better)
      const cartId = document.cookie
        .split('; ')
        .find(row => row.startsWith('cart_id='))
        ?.split('=')[1];
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const response = await fetch('/api/Checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          paymentMethod: formData.paymentMethod,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
      
      const order = await response.json();
      
      // Clear cart cookie
      document.cookie = 'cart_id=; Max-Age=0';
      
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
      
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
      Checkout
      
      
        {/* Contact Information */}
        
          Contact Information
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        
        
        {/* Shipping Address */}
        
          Shipping Address
          
            
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            
            <input
              type="text"
              placeholder="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
              <input
                type="text"
                placeholder="City"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Postal Code"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            
          
        
        
        {/* Payment Method */}
        
          Payment Method
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            Credit Card (Stripe)
            PayPal
          
        
        
        
          {loading ? 'Processing...' : 'Place Order'}
        
      
    
  )
}
