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
    
      
        {/* Image Gallery */}
        
          
            
          
          
          {product.images && product.images.length > 1 && (
            
              {product.images.slice(1, 5).map((img: any, idx: number) => (
                
                  
                
              ))}
            
          )}
        
        
        {/* Product Info */}
        
          {product.title}
          
          {price && (
            
              ${price.amount.toFixed(2)} {price.currencyCode}
            
          )}
          
          {product.description}
          
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            
              Select Variant
              
                {product.variants.map((variant: any) => (
                  
                    
                      {variant.title}
                      SKU: {variant.sku}
                    
                    
                  
                ))}
              
            
          )}
          
          {/* Stock Info */}
          {defaultVariant && (
            
              {defaultVariant.inventoryQuantity > 0 ? (
                ✓ In Stock ({defaultVariant.inventoryQuantity} available)
              ) : (
                Out of Stock
              )}
            
          )}
        
      
    
  )
}
