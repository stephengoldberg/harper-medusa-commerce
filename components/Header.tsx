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
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        Medusa Commerce
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/products" className="hover:text-blue-600 transition">
                            Products
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition">
                            About
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative hover:text-blue-600 transition">
                            <span className="text-2xl">🛒</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
                            )}
                        </Link>

                        <Link
                            href="/auth/login"
                            className="px-4 py-2 text-sm border rounded hover:bg-gray-50 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}