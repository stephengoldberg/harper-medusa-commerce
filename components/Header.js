'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Medusa Commerce
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/products"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/categories"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <button
                            className="hidden md:block p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Search"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>

                        {/* Account Icon */}
                        <Link
                            href="/account"
                            className="hidden md:block p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Account"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </Link>

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {/* Cart Badge */}
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                0
                            </span>
                        </Link>

                        {/* Admin Link */}
                        <Link
                            href="/admin"
                            className="hidden md:block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                        >
                            Admin
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/products"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/categories"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <Link
                                href="/account"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Account
                            </Link>
                            <Link
                                href="/admin"
                                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}