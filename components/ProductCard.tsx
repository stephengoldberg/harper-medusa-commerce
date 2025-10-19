import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0]?.url || product.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
  const price = product.variants?.[0]?.prices?.[0];
  
  return (
    
      
        
          
        
        
          
            {product.title}
          
          {price && (
            
              ${price.amount.toFixed(2)}
            
          )}
        
      
    
  )
}
