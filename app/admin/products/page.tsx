import { getProduct } from '@/actions';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }: { params: { id: string } }) {
    // Server-side rendering with ZERO network latency
    const product = await getProduct(params.id);

    return (
        <div>
            <h1>{product.title}</h1>
            <p>{product.description}</p>

            <div>
                {product.variants.map(variant => (
                    <div key={variant.id}>
                        <span>{variant.title}</span>
                        <span>${variant.prices[0].amount}</span>
                        <AddToCartButton variantId={variant.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}