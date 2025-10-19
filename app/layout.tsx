import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Medusa Commerce',
  description: 'E-commerce platform built on HarperDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      
        
        
          {children}
        
        
      
    
  )
}
