import { getProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const products = await getProducts({ limit: 12 });
  
  return (
    
      
        Featured Products
        Discover our latest collection
      
      
      
        {products.map((product: any) => (
          
        ))}
      
      
      
        
          View All Products
        
      
    
  )
}
