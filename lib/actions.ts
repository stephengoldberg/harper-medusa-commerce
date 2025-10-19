'use server'

import { cookies } from 'next/headers';

// @ts-ignore
const { Product, ProductVariant, Cart, LineItem, Order, Customer, Region } = tables;

// ==========================================
// PRODUCT ACTIONS
// ==========================================

export async function getProducts({
                                      limit = 20,
                                      offset = 0,
                                      status = 'published'
                                  }: {
    limit?: number;
    offset?: number;
    status?: string;
}) {
    return await Product.search({
        conditions: [
            { attribute: 'status', comparator: 'eq', value: status }
        ],
        limit,
        offset,
        select: ['*', 'variants.*', 'variants.prices.*', 'images.*']
    });
}

export async function getProduct(id: string) {
    return await Product.get(id, {
        select: ['*', 'variants.*', 'variants.prices.*', 'images.*', 'options.*']
    });
}

// ==========================================
// CART ACTIONS
// ==========================================

export async function getOrCreateCart() {
    const cookieStore = cookies();
    let cartId = cookieStore.get('cart_id')?.value;

    if (cartId) {
        const cart = await Cart.get(cartId);
        if (cart && !cart.completedAt) {
            return cart;
        }
    }

    // Get default region
    const regions = await Region.search({
        conditions: [{ attribute: 'currencyCode', comparator: 'eq', value: 'USD' }]
    });

    const cart = await Cart.create({
        regionId: regions[0].id,
        subtotal: 0,
        tax: 0,
        total: 0
    });

    cookieStore.set('cart_id', cart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return cart;
}

export async function getCart(cartId: string) {
    return await Cart.get(cartId, {
        select: [
            '*',
            'items.*',
            'items.variant.*',
            'items.variant.product.*',
            'items.variant.product.images.*',
            'region.*'
        ]
    });
}

export async function addToCart(variantId: string, quantity: number = 1) {
    const cart = await getOrCreateCart();

    const variant = await ProductVariant.get(variantId, {
        select: ['*', 'prices.*', 'product.*']
    });

    if (!variant) {
        throw new Error('Variant not found');
    }

    const price = variant.prices.find((p: any) => p.regionId === cart.regionId);

    if (!price) {
        throw new Error('Price not available');
    }

    await LineItem.create({
        cartId: cart.id,
        variantId,
        title: variant.product.title,
        quantity,
        unitPrice: price.amount,
        subtotal: price.amount * quantity,
        total: price.amount * quantity
    });

    await recalculateCart(cart.id);

    return await getCart(cart.id);
}

export async function updateCartItem(itemId: string, quantity: number) {
    const item = await LineItem.get(itemId);

    const updated = LineItem.update({ id: itemId });
    updated.quantity = quantity;
    updated.subtotal = item.unitPrice * quantity;
    updated.total = updated.subtotal;

    await recalculateCart(item.cartId);

    return await getCart(item.cartId);
}

export async function removeCartItem(itemId: string) {
    const item = await LineItem.get(itemId);
    const cartId = item.cartId;

    await LineItem.delete({ id: itemId });
    await recalculateCart(cartId);

    return await getCart(cartId);
}

async function recalculateCart(cartId: string) {
    const items = await LineItem.search({
        conditions: [{ attribute: 'cartId', comparator: 'eq', value: cartId }]
    });

    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const cart = Cart.update({ id: cartId });
    cart.subtotal = subtotal;
    cart.tax = tax;
    cart.total = total;
}

// ==========================================
// ORDER ACTIONS
// ==========================================

export async function getOrder(orderId: string) {
    return await Order.get(orderId, {
        select: ['*', 'items.*', 'items.variant.*', 'payments.*']
    });
}

export async function getCustomerOrders(customerId: string) {
    return await Order.search({
        conditions: [
            { attribute: 'customerId', comparator: 'eq', value: customerId }
        ],
        select: ['*', 'items.*']
    });
}