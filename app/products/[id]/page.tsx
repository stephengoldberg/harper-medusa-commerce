import { getProduct } from '@/lib/actions'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: { id: string }
}) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.prices?.[0];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                            src={mainImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {product.images.slice(1, 5).map((img: any, idx: number) => (
                                <div key={idx} className="aspect-square relative rounded overflow-hidden bg-gray-100">
                                    <Image
                                        src={img.url}
                                        alt={`${product.title} ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

                    {price && (
                        <div className="text-2xl font-semibold mb-6">
                            ${price.amount.toFixed(2)} {price.currencyCode}
                        </div>
                    )}

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Select Variant</h3>
                            <div className="space-y-2">
                                {product.variants.map((variant: any) => (
                                    <div key={variant.id} className="flex items-center justify-between p-3 border rounded hover:border-blue-500">
                                        <div>
                                            <div className="font-medium">{variant.title}</div>
                                            <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                                        </div>
                                        <AddToCartButton variantId={variant.id} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock Info */}
                    {defaultVariant && (
                        <div className="text-sm text-gray-500">
                            {defaultVariant.inventoryQuantity > 0 ? (
                                <span className="text-green-600">✓ In Stock ({defaultVariant.inventoryQuantity} available)</span>
                            ) : (
                                <span className="text-red-600">Out of Stock</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}