'use client'

import { useState } from 'react'
import { getCart, updateCartItemQuantity, removeFromCart } from '@/app/actions'
import { useRouter } from 'next/navigation'

export function CartClient({ initialCart, userId }) {
    const [cart, setCart] = useState(initialCart)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    const refreshCart = async () => {
        const updatedCart = await getCart(userId)
        setCart(updatedCart)
    }

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return

        setIsUpdating(true)
        try {
            await updateCartItemQuantity(cart.id, productId, newQuantity)
            await refreshCart()
        } catch (error) {
            console.error('Failed to update quantity:', error)
            alert('Failed to update quantity')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleRemoveItem = async (productId) => {
        if (!confirm('Remove this item from cart?')) return

        setIsUpdating(true)
        try {
            await removeFromCart(cart.id, productId)
            await refreshCart()
        } catch (error) {
            console.error('Failed to remove item:', error)
            alert('Failed to remove item')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleCheckout = () => {
        router.push('/checkout')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                    <div
                        key={item.product_id}
                        className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
                    >
                        {/* Product Image Placeholder */}
                        <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                ${item.price.toFixed(2)} each
                            </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-medium">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => handleRemoveItem(item.product_id)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="border-t pt-3">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>${cart.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isUpdating}
                        className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>

                    <a
                        href="/products"
                        className="block text-center mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Continue Shopping
                    </a>

                    {/* Cart Items Count */}
                    <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in cart
                    </div>
                </div>
            </div>
        </div>
    )
}