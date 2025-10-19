import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }: { product: any }) {
    const image = product.images?.[0]?.url || product.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
    const price = product.variants?.[0]?.prices?.[0];

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition">
                <div className="aspect-square relative bg-gray-100">
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition">
                        {product.title}
                    </h3>
                    {price && (
                        <div className="text-lg font-bold text-blue-600">
                            ${price.amount.toFixed(2)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}