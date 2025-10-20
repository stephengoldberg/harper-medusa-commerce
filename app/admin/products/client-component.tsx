'use client'

import { useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/app/actions'

interface Product {
    id: string
    name: string
    description?: string
    price: number
    inventory?: number
    sku?: string
    [key: string]: any
}

interface ProductsClientProps {
    initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        inventory: 0,
        sku: ''
    })

    // Refresh products list
    const refreshProducts = async () => {
        const updated = await getProducts()
        setProducts(updated)
    }

    // Handle create product
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createProduct({
                name: formData.name,
                description: formData.description,
                price: formData.price,
                inventory: formData.inventory,
                sku: formData.sku
            })

            // Reset form and refresh
            setFormData({ name: '', description: '', price: 0, inventory: 0, sku: '' })
            setIsCreating(false)
            await refreshProducts()
        } catch (error) {
            console.error('Failed to create product:', error)
            alert('Failed to create product')
        }
    }

    // Handle update product
    const handleUpdate = async (id: string) => {
        try {
            await updateProduct(id, formData)

            // Reset form and refresh
            setFormData({ name: '', description: '', price: 0, inventory: 0, sku: '' })
            setEditingId(null)
            await refreshProducts()
        } catch (error) {
            console.error('Failed to update product:', error)
            alert('Failed to update product')
        }
    }

    // Handle delete product
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await deleteProduct(id)
            await refreshProducts()
        } catch (error) {
            console.error('Failed to delete product:', error)
            alert('Failed to delete product')
        }
    }

    // Start editing a product
    const startEdit = (product: Product) => {
        setEditingId(product.id)
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            inventory: product.inventory || 0,
            sku: product.sku || ''
        })
        setIsCreating(false)
    }

    return (
        <div className="space-y-6">
            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Edit Product' : 'Create New Product'}
                    </h2>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        if (editingId) {
                            handleUpdate(editingId)
                        } else {
                            handleCreate(e)
                        }
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Inventory
                                </label>
                                <input
                                    type="number"
                                    value={formData.inventory}
                                    onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {editingId ? 'Update Product' : 'Create Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false)
                                    setEditingId(null)
                                    setFormData({ name: '', description: '', price: 0, inventory: 0, sku: '' })
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Button */}
            {!isCreating && !editingId && (
                <div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        + Create New Product
                    </button>
                </div>
            )}

            {/* Products List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inventory
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No products found. Create your first product to get started.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    {product.description && (
                                        <div className="text-sm text-gray-500">{product.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {product.sku || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {product.inventory || 0}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => startEdit(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}