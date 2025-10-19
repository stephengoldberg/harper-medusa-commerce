import { getOrder } from '@/lib/actions'
import { notFound } from 'next/navigation'

export default async function OrderPage({
                                            params,
                                        }: {
    params: { id: string }
}) {
    const order = await getOrder(params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center">
                        <div className="text-green-600 text-4xl mr-4">✓</div>
                        <div>
                            <h1 className="text-2xl font-bold text-green-900">Order Confirmed!</h1>
                            <p className="text-green-700">Thank you for your purchase</p>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Order ID:</span>
                            <div className="font-medium">{order.id}</div>
                        </div>
                        <div>
                            <span className="text-gray-600">Status:</span>
                            <div className="font-medium capitalize">{order.status}</div>
                        </div>
                        <div>
                            <span className="text-gray-600">Email:</span>
                            <div className="font-medium">{order.email}</div>
                        </div>
                        <div>
                            <span className="text-gray-600">Date:</span>
                            <div className="font-medium">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Items</h2>
                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                </div>
                                <div className="font-semibold">${item.total.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${order.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>${order.tax?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>${order.total?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div className="bg-white rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="text-gray-700">
                            <div>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                            <div>{order.shippingAddress.address}</div>
                            <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                            <div>{order.shippingAddress.country}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}