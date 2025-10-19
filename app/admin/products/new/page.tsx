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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-lg border p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Handle (URL slug)</label>
                        <input
                            type="text"
                            value={formData.handle}
                            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                            placeholder="auto-generated-from-title"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                        <input
                            type="url"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    {/* Variant Info */}
                    <div className="pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">SKU *</label>
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price (USD) *</label>
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Inventory Quantity</label>
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}