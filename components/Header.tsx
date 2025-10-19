import Link from 'next/link'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/actions'

export default async function Header() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cart_id')?.value;
  
  let itemCount = 0;
  if (cartId) {
    try {
      const cart = await getCart(cartId);
      itemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
    } catch (error) {
      // Cart not found or error
    }
  }
  
  return (
    
      
        
          
            Medusa Commerce
          
          
          
            
              Products
            
            
              About
            
          
          
          
            
              🛒
              {itemCount > 0 && (
                
                  {itemCount}
                
              )}
            
            
            
              Login
            
          
        
      
    
  )
}
