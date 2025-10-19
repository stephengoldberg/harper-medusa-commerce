import { getProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'

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
    
      All Products
      
      
        {products.map((product: any) => (
          
        ))}
      
      
      
        {page > 1 && (
          <a
            href={`/products?page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          
        )}
        {products.length === limit && (
          <a
            href={`/products?page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          
        )}
      
    
  )
}