'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handle: '',
    status: 'draft',
    thumbnail: '',
    variants: [{
      title: 'Default',
      sku: '',
      inventoryQuantity: 0,
      prices: [{
        amount: 0,
        currencyCode: 'USD',
        regionId: 'default-region-id'
      }]
    }]
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/ProductResource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      const product = await response.json();
      toast.success('Product created successfully!');
      router.push('/admin/products');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
      Add New Product
      
      
        
          {/* Basic Info */}
          
            Title *
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            Description
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            Handle (URL slug)
            <input
              type="text"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              placeholder="auto-generated-from-title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            Thumbnail URL
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            Status
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              Draft
              Published
            
          
          
          {/* Variant Info */}
          
            Default Variant
            
            
              
                SKU *
                <input
                  type="text"
                  required
                  value={formData.variants[0].sku}
                  onChange={(e) => setFormData({
                    ...formData,
                    variants: [{
                      ...formData.variants[0],
                      sku: e.target.value
                    }]
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              
              
              
                Price (USD) *
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.variants[0].prices[0].amount}
                  onChange={(e) => setFormData({
                    ...formData,
                    variants: [{
                      ...formData.variants[0],
                      prices: [{
                        ...formData.variants[0].prices[0],
                        amount: parseFloat(e.target.value)
                      }]
                    }]
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              
              
              
                Inventory Quantity
                <input
                  type="number"
                  value={formData.variants[0].inventoryQuantity}
                  onChange={(e) => setFormData({
                    ...formData,
                    variants: [{
                      ...formData.variants[0],
                      inventoryQuantity: parseInt(e.target.value)
                    }]
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              
            
          
        
        
        
          
            {loading ? 'Creating...' : 'Create Product'}
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          
        
      
    
  )
}
