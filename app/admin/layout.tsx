import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      {/* Sidebar */}
      
        Admin Panel
        
          
            Dashboard
          
          
            Products
          
          
            Orders
          
          
            Customers
          
        
      
      
      {/* Main Content */}
      
        {children}
      
    
  )
}

