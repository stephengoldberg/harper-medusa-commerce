'use client'

import { useState } from 'react'
import { addToCart, getCart, createCart } from '@/app/actions'

export function AddToCartButton({ productId, disabled }) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [message, setMessage] = useState('')

    const handleAddToCart = async () => {
        setIsAdding(true)
        setMessage('')

        try {
            // In a real app, you'd get the user ID from authentication
            // For now, we'll use a demo user ID
            const userId = 'demo-user-id'

            // Get or create cart
            let cart = await getCart(userId)
            if (!cart) {
                cart = await createCart(userId)
            }

            // Add product to cart
            await addToCart(cart.id, productId, quantity)

            setMessage('Added to cart successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            console.error('Failed to add to cart:', error)
            setMessage('Failed to add to cart. Please try again.')
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={disabled || isAdding}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                        disabled={disabled || isAdding}
                    />
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={disabled || isAdding}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={disabled || isAdding}
                className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                    disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
                {isAdding ? 'Adding...' : disabled ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Success/Error Message */}
            {message && (
                <div
                    className={`p-3 rounded-md text-sm ${
                        message.includes('success')
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    )
}