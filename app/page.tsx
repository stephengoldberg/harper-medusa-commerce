import { getProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
    const products = await getProducts({ limit: 12 });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Featured Products</h1>
                <p className="text-gray-600">Discover our latest collection</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/products"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    View All Products
                </Link>
            </div>
        </div>
    )
}