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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                {/* Contact Information */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <input
                            type="text"
                            placeholder="Address"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="stripe">Credit Card (Stripe)</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    )
}