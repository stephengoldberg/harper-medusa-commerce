'use server'

const { Product, ProductVariant, Cart, LineItem } = tables;

// Direct database access from Next.js - NO HTTP OVERHEAD!
export async function getProducts({ limit = 20, offset = 0 }) {
    return await Product.search({
        conditions: [
            { attribute: 'status', comparator: 'eq', value: 'published' }
        ],
        limit,
        offset,
        select: ['*', 'variants.*', 'images.*']
    });
}

export async function getProduct(id) {
    return await Product.get(id, {
        select: ['*', 'variants.*', 'variants.prices.*', 'images.*']
    });
}

export async function addToCart(cartId, variantId, quantity) {
    const cart = await Cart.get(cartId);
    const variant = await ProductVariant.get(variantId, {
        select: ['*', 'prices.*', 'product.*']
    });

    const price = variant.prices.find(p => p.regionId === cart.regionId);

    return await LineItem.create({
        cartId,
        variantId,
        title: variant.product.title,
        quantity,
        unitPrice: price.amount,
        subtotal: price.amount * quantity,
        total: price.amount * quantity
    });
}