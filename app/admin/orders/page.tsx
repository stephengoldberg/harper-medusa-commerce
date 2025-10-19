// @ts-ignore
const { Order } = tables;

export default async function AdminOrdersPage() {
    const orders = await Order.search({
        limit: 100,
        select: ['*', 'customer.*', 'items.*']
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Orders</h1>

            <div className="bg-white rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div>{order.email}</div>
                                    {order.customer && (
                                        <div className="text-xs text-gray-500">
                                            {order.customer.firstName} {order.customer.lastName}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">{order.items?.length || 0}</td>
                                <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs capitalize">
                      {order.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                      {order.paymentStatus}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    ${order.total?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}