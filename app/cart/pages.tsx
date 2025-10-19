import { cookies } from 'next/headers'
import { getCart } from '@/lib/actions'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default async function CartPage() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cart_id')?.value;
  
  if (!cartId) {
    return (
      
        Your cart is empty
        
          Continue Shopping
        
      
    );
  }
  
  const cart = await getCart(cartId);
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      
        Your cart is empty
        
          Continue Shopping
        
      
    );
  }
  
  return (
    
      Shopping Cart
      
      
        {/* Cart Items */}
        
          {cart.items.map((item: any) => (
            
          ))}
        
        
        {/* Order Summary */}
        
          
            Order Summary
            
            
              
                Subtotal
                ${cart.subtotal?.toFixed(2)}
              
              
                Tax
                ${cart.tax?.toFixed(2)}
              
              
                Total
                ${cart.total?.toFixed(2)}
              
            
            
            
              Proceed to Checkout
            
            
            
              Continue Shopping
            
          
        
      
    
  )
}
