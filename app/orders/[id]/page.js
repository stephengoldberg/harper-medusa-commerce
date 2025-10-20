import { getOrder } from '@/app/actions'
import { notFound } from 'next/navigation'

export default async function OrderDetailPage({ params }) {
    try {
        const order = await getOrder(params.id)

        if (!order) {
            notFound()
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Order #{order.id.slice(0, 8)}
                        </h1>
                        <p className="text-gray-600">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full font-semibold ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                'bg-red-100 text-red-800'
                            }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                                        {/* Product Image Placeholder */}
                                        <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                            <svg
                                                className="w-10 h-10 text-gray-400"
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
                                            <h3 className="font-semibold text-gray-900">
                                                {item.name || item.product_name || 'Product'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ${(item.price || 0).toFixed(2)} each
                                            </p>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No items found</p>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <div className="text-gray-700">
                                {order.shipping_address.name && (
                                    <p className="font-medium">{order.shipping_address.name}</p>
                                )}
                                {order.shipping_address.street && (
                                    <p>{order.shipping_address.street}</p>
                                )}
                                {order.shipping_address.city && order.shipping_address.state && order.shipping_address.zip && (
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                                    </p>
                                )}
                                {order.shipping_address.country && (
                                    <p>{order.shipping_address.country}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">
                                    {order.payment_method || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium text-gray-900">
                                    ${(order.total || 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium text-gray-900">
                                    ${(order.shipping || 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium text-gray-900">
                                    ${(order.tax || 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total:</span>
                                    <span className="text-gray-900">
                                        ${(order.total || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    {order.email && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                            <p className="text-gray-700">{order.email}</p>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="flex gap-4">
                        <a
                            href="/orders"
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                        >
                            ← Back to Orders
                        </a>

                        {order.status === 'completed' && (
                            <a
                                href={`/orders/${order.id}/invoice`}
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                            >
                                Download Invoice
                            </a>
                        )}
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error loading order:', error)
        notFound()
    }
}