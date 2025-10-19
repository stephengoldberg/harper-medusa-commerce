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
        <div className="flex gap-4 p-4 bg-white rounded-lg border">
            <div className="w-24 h-24 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                    src={image}
                    alt={item.title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    {item.variant?.title}
                </p>
                <div className="text-lg font-bold text-blue-600">
                    ${item.unitPrice.toFixed(2)}
                </div>
            </div>

            <div className="flex flex-col items-end justify-between">
                <button
                    onClick={handleRemove}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                >
                    Remove
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        disabled={loading}
                        className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        +
                    </button>
                </div>

                <div className="font-bold">
                    ${item.total.toFixed(2)}
                </div>
            </div>
        </div>
    )
}