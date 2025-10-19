import { getOrder } from '@/lib/actions'
import { notFound } from 'next/navigation'

export default async function OrderPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id);
  
  if (!order) {
    notFound();
  }
  
  return (
    
      
        {/* Success Message */}
        
          
            ✓
            
              Order Confirmed!
              Thank you for your purchase
            
          
        
        
        {/* Order Details */}
        
          Order Details
          
            
              Order ID:
              {order.id}
            
            
              Status:
              {order.status}
            
            
              Email:
              {order.email}
            
            
              Date:
              
                {new Date(order.createdAt).toLocaleDateString()}
              
            
          
        
        
        {/* Items */}
        
          Items
          
            {order.items?.map((item: any) => (
              
                
                  {item.title}
                  Quantity: {item.quantity}
                
                ${item.total.toFixed(2)}
              
            ))}
          
        
        
        {/* Total */}
        
          
            
              Subtotal
              ${order.subtotal?.toFixed(2)}
            
            
              Tax
              ${order.tax?.toFixed(2)}
            
            
              Total
              ${order.total?.toFixed(2)}
            
          
        
        
        {/* Shipping Address */}
        {order.shippingAddress && (
          
            Shipping Address
            
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              {order.shippingAddress.address}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              {order.shippingAddress.country}
            
          
        )}
      
    
  )
}
```

---

## 8. React Components

### components/Header.tsx
```typescript
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

