import { getProducts } from '@/app/actions'
import { ProductsClient } from './client-component'

export default async function ProductsPage() {
    // Fetch products on the server
    const products = await getProducts()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600 mt-2">Manage your product catalog</p>
            </div>

            {/* Pass initial products to client component */}
            <ProductsClient initialProducts={products} />
        </div>
    )
}