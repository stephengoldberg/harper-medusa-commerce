import { getProducts } from '@/lib/actions'

async function getAdminStats() {
    'use server'

    try {
        // @ts-ignore
        const { Order, Customer, Product } = tables;

        const orders = await Order.search({ limit: 1000 });
        const customers = await Customer.search({ limit: 1000 });
        const products = await Product.search({ limit: 1000 });

        const totalRevenue = orders.reduce((sum: number, order: any) => {
            return sum + (order.total || 0);
        }, 0);

        const recentOrders = await Order.search({
            limit: 10,
            select: ['*', 'customer.*']
        });

        return {
            totalRevenue,
            ordersCount: orders.length,
            customersCount: customers.length,
            productsCount: products.length,
            recentOrders
        };
    } catch (error) {
        return {
            totalRevenue: 0,
            ordersCount: 0,
            customersCount: 0,
            productsCount: 0,
            recentOrders: []
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border">
                    <div className="text-gray-600 text-sm mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold text-green-600">
                        ${stats.totalRevenue.toFixed(2)}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="text-gray-600 text-sm mb-2">Total Orders</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {stats.ordersCount}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="text-gray-600 text-sm mb-2">Total Customers</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {stats.customersCount}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="text-gray-600 text-sm mb-2">Total Products</div>
                    <div className="text-3xl font-bold text-orange-600">
                        {stats.productsCount}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {stats.recentOrders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-sm">{order.email}</td>
                                <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {order.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">${order.total?.toFixed(2)}</td>
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