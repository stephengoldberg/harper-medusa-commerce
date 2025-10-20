'use server'

// CRITICAL: Import harperdb first to access the tables global
import 'harperdb'

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts() {
    try {
        const products = await tables.Product.search({})
        return products
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

export async function getProduct(id) {
    try {
        const product = await tables.Product.get(id)
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
// CART ACTIONS
// ============================================

export async function getCart(userId) {
    try {
        const cart = await tables.Cart.search({ user_id: userId })
        return cart[0] || null
    } catch (error) {
        console.error('Error fetching cart:', error)
        throw error
    }
}

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

export async function addToCart(cartId, productId, quantity) {
    try {
        const cart = await tables.Cart.get(cartId)
        const product = await tables.Product.get(productId)

        const existingItem = cart.items?.find(item => item.product_id === productId)

        let updatedItems
        if (existingItem) {
            updatedItems = cart.items.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            )
        } else {
            updatedItems = [
                ...(cart.items || []),
                {
                    product_id: productId,
                    quantity,
                    price: product.price,
                    name: product.name
                }
            ]
        }

        const total = updatedItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        )

        const updatedCart = await tables.Cart.update(cartId, {
            items: updatedItems,
            total
        })

        return updatedCart
    } catch (error) {
        console.error('Error adding to cart:', error)
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

export async function getOrder(id) {
    try {
        const order = await tables.Order.get(id)
        return order
    } catch (error) {
        console.error('Error fetching order:', error)
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