import { getProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function ProductsPage({
                                               searchParams,
                                           }: {
    searchParams: { page?: string; q?: string }
}) {
    const page = parseInt(searchParams.page || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const products = await getProducts({ limit, offset });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
                {page > 1 && (
                    <Link
                        href={`/products?page=${page - 1}`}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Previous
                    </Link>
                )}
                {products.length === limit && (
                    <Link
                        href={`/products?page=${page + 1}`}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next
                    </Link>
                )}
            </div>
        </div>
    )
}