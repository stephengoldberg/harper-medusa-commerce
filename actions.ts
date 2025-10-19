'use server'

import { cookies } from 'next/headers';

// Safe access to tables
const getTables = () => {
    if (typeof tables === 'undefined') {
        return null;
    }
    return tables;
};

const db = getTables();

// Only destructure if tables exist
const { Product, ProductVariant, Cart, LineItem, Order, Customer, Region } = db || {};

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
    if (!Product) return [];

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
    if (!Product) return null;

    return await Product.get(id, {
        select: ['*', 'variants.*', 'variants.prices.*', 'images.*', 'options.*']
    });
}


export async function addToCart(cartId:string, variantId:string, quantity:number) {
    const cart = await Cart.get(cartId);
    const variant = await ProductVariant.get(variantId, {
        select: ['*', 'prices.*', 'product.*']
    });

    const price = variant.prices.find((p: { regionId: any; }) => p.regionId === cart.regionId);

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