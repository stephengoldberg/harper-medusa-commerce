import { cookies } from 'next/headers'
import { getCart } from '@/lib/actions'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default async function CartPage() {
    const cookieStore = cookies();
    const cartId = cookieStore.get('cart_id')?.value;

    if (!cartId) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const cart = await getCart(cartId);

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item: any) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${cart.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">${cart.tax?.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between">
                                <span className="font-semibold text-lg">Total</span>
                                <span className="font-bold text-lg">${cart.total?.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/products"
                            className="block w-full text-center text-blue-600 hover:underline mt-4"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}