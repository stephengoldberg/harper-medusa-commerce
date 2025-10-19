const { Order, Customer, Product } = tables;

export default async function AdminDashboard() {
  // Get stats
  const orders = await Order.search({ limit: 1000 });
  const customers = await Customer.search({ limit: 1000 });
  const products = await Product.search({ limit: 1000 });
  
  const totalRevenue = orders.reduce((sum: number, order: any) => {
    return sum + (order.total || 0);
  }, 0);
  
  const recentOrders = await Order.search({
    limit: 10,
    select: ['*', 'customer.*']
  });
  
  return (
    
      Dashboard
      
      {/* Stats Grid */}
      
        
          Total Revenue
          
            ${totalRevenue.toFixed(2)}
          
        
        
        
          Total Orders
          
            {orders.length}
          
        
        
        
          Total Customers
          
            {customers.length}
          
        
        
        
          Total Products
          
            {products.length}
          
        
      
      
      {/* Recent Orders */}
      
        
          Recent Orders
        
        
          
            
              
                Order ID
                Customer
                Status
                Total
                Date
              
            
            
              {recentOrders.map((order: any) => (
                
                  {order.id.slice(0, 8)}
                  {order.email}
                  
                    
                      {order.status}
                    
                  
                  ${order.total?.toFixed(2)}
                  
                    {new Date(order.createdAt).toLocaleDateString()}
                  
                
              ))}
            
          
        
      
    
  )
}

