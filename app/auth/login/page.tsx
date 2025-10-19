'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/CustomerAuth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          ...formData
        })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const { customer, token } = await response.json();
      
      // Store token
      localStorage.setItem('auth_token', token);
      localStorage.setItem('customer', JSON.stringify(customer));
      
      toast.success('Logged in successfully!');
      router.push('/');
      
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
      
        Login
        
        
          
            Email
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            Password
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          
          
          
            {loading ? 'Logging in...' : 'Login'}
          
          
          
            Don't have an account?{' '}
            
              Register
            
          
        
      
    
  )
}

