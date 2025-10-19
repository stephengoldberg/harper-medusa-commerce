const { Order } = tables;

export default async function AdminOrdersPage() {
  const orders = await Order.search({
    limit: 100,
    select: ['*', 'customer.*', 'items.*']
  });
  
  return (
    
      Orders
      
      
        
          
            
              
                Order ID
                Customer
                Items
                Status
                Payment
                Total
                Date
              
            
            
              {orders.map((order: any) => (
                
                  
                    {order.id.slice(0, 8)}...
                  
                  
                    {order.email}
                    {order.customer && (
                      
                        {order.customer.firstName} {order.customer.lastName}
                      
                    )}
                  
                  {order.items?.length || 0}
                  
                    
                      {order.status}
                    
                  
                  
                    
                      {order.paymentStatus}
                    
                  
                  
                    ${order.total?.toFixed(2)}
                  
                  
                    {new Date(order.createdAt).toLocaleDateString()}
                  
                
              ))}
            
          
        
      
    
  )
}

