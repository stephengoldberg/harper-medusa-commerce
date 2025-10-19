import Link from 'next/link'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        className="block px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="block px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="block px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Orders
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="block px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Customers
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50">
                {children}
            </main>
        </div>
    )
}