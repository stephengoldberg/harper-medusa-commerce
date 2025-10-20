import { getProduct } from '@/app/actions'
import { AddToCartButton } from './add-to-cart-button'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({ params }) {
    try {
        const product = await getProduct(params.id)

        if (!product) {
            notFound()
        }

        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                            <svg
                                className="w-32 h-32 text-gray-400"
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

                        {/* Product Details */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {product.sku && (
                                <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
                            )}

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                        Description
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.inventory > 0 ? (
                                    <div className="flex items-center text-green-600">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            In Stock ({product.inventory} available)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart */}
                            <AddToCartButton
                                productId={product.id}
                                disabled={product.inventory <= 0}
                            />

                            {/* Additional Product Info */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Product Information
                                </h3>
                                <dl className="space-y-2">
                                    <div className="flex">
                                        <dt className="text-gray-600 w-32">Product ID:</dt>
                                        <dd className="text-gray-900">{product.id.slice(0, 8)}</dd>
                                    </div>
                                    {product.sku && (
                                        <div className="flex">
                                            <dt className="text-gray-600 w-32">SKU:</dt>
                                            <dd className="text-gray-900">{product.sku}</dd>
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="flex">
                                            <dt className="text-gray-600 w-32">Category:</dt>
                                            <dd className="text-gray-900">{product.category}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Back to Products */}
                            <div className="mt-8">
                                <a
                                    href="/products"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    ← Back to Products
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error loading product:', error)
        notFound()
    }
}