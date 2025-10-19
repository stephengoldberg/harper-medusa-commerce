import Link from 'next/link'
import { getProducts } from '@/lib/actions'

export default async function AdminProductsPage() {
    const products = await getProducts({ limit: 100, status: 'published' });
    const drafts = await getProducts({ limit: 100, status: 'draft' });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Add Product
                </Link>
            </div>

            {/* Published Products */}
            <div className="bg-white rounded-lg border mb-6">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Published Products ({products.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {products.map((product: any) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{product.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.handle}</td>
                                <td className="px-6 py-4 text-sm">{product.variants?.length || 0}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Draft Products */}
            {drafts.length > 0 && (
                <div className="bg-white rounded-lg border">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Draft Products ({drafts.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {drafts.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">{product.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.handle}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}