'use server'

// CRITICAL: Import harperdb first to access the tables global
import 'harperdb'
import { cookies } from 'next/headers'

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts({ limit = 20, offset = 0, status = 'published' } = {}) {
    try {
        const products = await tables.Product.search({
            conditions: [
                { attribute: 'status', comparator: 'eq', value: status }
            ],
            limit,
            offset,
            select: ['*', 'variants.*', 'variants.prices.*', 'images.*']
        })
        return products
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

export async function getProduct(id) {
    try {
        const product = await tables.Product.get(id, {
            select: ['*', 'variants.*', 'variants.prices.*', 'images.*', 'options.*']
        })
        return product
    } catch (error) {
        console.error('Error fetching product:', error)
        throw error
    }
}

export async function createProduct(data) {
    try {
        const product = await tables.Product.create(data)
        return product
    } catch (error) {
        console.error('Error creating product:', error)
        throw error
    }
}

export async function updateProduct(id, data) {
    try {
        const product = await tables.Product.update(id, data)
        return product
    } catch (error) {
        console.error('Error updating product:', error)
        throw error
    }
}

export async function deleteProduct(id) {
    try {
        await tables.Product.delete(id)
        return { success: true }
    } catch (error) {
        console.error('Error deleting product:', error)
        throw error
    }
}

// ============================================
// PRODUCT VARIANT ACTIONS
// ============================================

export async function getProductVariant(variantId) {
    try {
        const variant = await tables.ProductVariant.get(variantId, {
            select: ['*', 'prices.*', 'product.*']
        })
        return variant
    } catch (error) {
        console.error('Error fetching product variant:', error)
        throw error
    }
}

// ============================================
// CART ACTIONS (WITH COOKIES)
// ============================================

export async function getOrCreateCart() {
    try {
        const cookieStore = await cookies()
        let cartId = cookieStore.get('cart_id')?.value

        if (cartId) {
            const cart = await tables.Cart.get(cartId)
            if (cart && !cart.completedAt) {
                return cart
            }
        }

        // Get default region
        const regions = await tables.Region.search({
            conditions: [{ attribute: 'currencyCode', comparator: 'eq', value: 'USD' }]
        })

        const cart = await tables.Cart.create({
            regionId: regions[0]?.id,
            subtotal: 0,
            tax: 0,
            total: 0
        })

        cookieStore.set('cart_id', cart.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return cart
    } catch (error) {
        console.error('Error getting or creating cart:', error)
        throw error
    }
}

export async function getCart(cartId) {
    try {
        if (!cartId) {
            const cart = await getOrCreateCart()
            return cart
        }

        const cart = await tables.Cart.get(cartId, {
            select: [
                '*',
                'items.*',
                'items.variant.*',
                'items.variant.product.*',
                'items.variant.product.images.*',
                'region.*'
            ]
        })
        return cart
    } catch (error) {
        console.error('Error fetching cart:', error)
        throw error
    }
}

export async function addToCart(variantId, quantity = 1) {
    try {
        const cart = await getOrCreateCart()

        const variant = await tables.ProductVariant.get(variantId, {
            select: ['*', 'prices.*', 'product.*']
        })

        if (!variant) {
            throw new Error('Variant not found')
        }

        const price = variant.prices.find(p => p.regionId === cart.regionId)

        if (!price) {
            throw new Error('Price not available')
        }

        await tables.LineItem.create({
            cartId: cart.id,
            variantId,
            title: variant.product.title,
            quantity,
            unitPrice: price.amount,
            subtotal: price.amount * quantity,
            total: price.amount * quantity
        })

        await recalculateCart(cart.id)

        return await getCart(cart.id)
    } catch (error) {
        console.error('Error adding to cart:', error)
        throw error
    }
}

export async function updateCartItem(itemId, quantity) {
    try {
        const item = await tables.LineItem.get(itemId)

        const updated = tables.LineItem.update({ id: itemId })
        updated.quantity = quantity
        updated.subtotal = item.unitPrice * quantity
        updated.total = updated.subtotal

        await recalculateCart(item.cartId)

        return await getCart(item.cartId)
    } catch (error) {
        console.error('Error updating cart item:', error)
        throw error
    }
}

export async function removeCartItem(itemId) {
    try {
        const item = await tables.LineItem.get(itemId)
        const cartId = item.cartId

        await tables.LineItem.delete({ id: itemId })
        await recalculateCart(cartId)

        return await getCart(cartId)
    } catch (error) {
        console.error('Error removing cart item:', error)
        throw error
    }
}

async function recalculateCart(cartId) {
    try {
        const items = await tables.LineItem.search({
            conditions: [{ attribute: 'cartId', comparator: 'eq', value: cartId }]
        })

        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
        const tax = subtotal * 0.1
        const total = subtotal + tax

        const cart = tables.Cart.update({ id: cartId })
        cart.subtotal = subtotal
        cart.tax = tax
        cart.total = total
    } catch (error) {
        console.error('Error recalculating cart:', error)
        throw error
    }
}

// ============================================
// SIMPLE CART ACTIONS (LEGACY SUPPORT)
// ============================================

export async function createCart(userId) {
    try {
        const cart = await tables.Cart.create({
            user_id: userId,
            items: [],
            total: 0
        })
        return cart
    } catch (error) {
        console.error('Error creating cart:', error)
        throw error
    }
}

export async function updateCartItemQuantity(cartId, productId, quantity) {
    try {
        const cart = await tables.Cart.get(cartId)

        const updatedItems = cart.items.map(item =>
            item.product_id === productId
                ? { ...item, quantity }
                : item
        )

        const total = updatedItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        )

        const updatedCart = await tables.Cart.update(cartId, {
            items: updatedItems,
            total
        })

        return updatedCart
    } catch (error) {
        console.error('Error updating cart item:', error)
        throw error
    }
}

export async function removeFromCart(cartId, productId) {
    try {
        const cart = await tables.Cart.get(cartId)

        const updatedItems = cart.items.filter(item => item.product_id !== productId)

        const total = updatedItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        )

        const updatedCart = await tables.Cart.update(cartId, {
            items: updatedItems,
            total
        })

        return updatedCart
    } catch (error) {
        console.error('Error removing from cart:', error)
        throw error
    }
}

// ============================================
// ORDER ACTIONS
// ============================================

export async function getOrders(userId) {
    try {
        if (userId) {
            return await tables.Order.search({ user_id: userId })
        }
        return await tables.Order.search({})
    } catch (error) {
        console.error('Error fetching orders:', error)
        throw error
    }
}

export async function getOrder(orderId) {
    try {
        const order = await tables.Order.get(orderId, {
            select: ['*', 'items.*', 'items.variant.*', 'payments.*']
        })
        return order
    } catch (error) {
        console.error('Error fetching order:', error)
        throw error
    }
}

export async function getCustomerOrders(customerId) {
    try {
        return await tables.Order.search({
            conditions: [
                { attribute: 'customerId', comparator: 'eq', value: customerId }
            ],
            select: ['*', 'items.*']
        })
    } catch (error) {
        console.error('Error fetching customer orders:', error)
        throw error
    }
}

export async function createOrder(data) {
    try {
        const order = await tables.Order.create({
            ...data,
            status: 'pending',
            created_at: new Date().toISOString()
        })
        return order
    } catch (error) {
        console.error('Error creating order:', error)
        throw error
    }
}

export async function updateOrderStatus(id, status) {
    try {
        const order = await tables.Order.update(id, { status })
        return order
    } catch (error) {
        console.error('Error updating order status:', error)
        throw error
    }
}

// ============================================
// CUSTOMER ACTIONS
// ============================================

export async function getCustomers() {
    try {
        const customers = await tables.Customer.search({})
        return customers
    } catch (error) {
        console.error('Error fetching customers:', error)
        throw error
    }
}

export async function getCustomer(id) {
    try {
        const customer = await tables.Customer.get(id)
        return customer
    } catch (error) {
        console.error('Error fetching customer:', error)
        throw error
    }
}

export async function createCustomer(data) {
    try {
        const customer = await tables.Customer.create(data)
        return customer
    } catch (error) {
        console.error('Error creating customer:', error)
        throw error
    }
}

export async function updateCustomer(id, data) {
    try {
        const customer = await tables.Customer.update(id, data)
        return customer
    } catch (error) {
        console.error('Error updating customer:', error)
        throw error
    }
}

// ============================================
// REGION ACTIONS
// ============================================

export async function getRegions() {
    try {
        const regions = await tables.Region.search({})
        return regions
    } catch (error) {
        console.error('Error fetching regions:', error)
        throw error
    }
}

export async function getRegion(id) {
    try {
        const region = await tables.Region.get(id)
        return region
    } catch (error) {
        console.error('Error fetching region:', error)
        throw error
    }
}