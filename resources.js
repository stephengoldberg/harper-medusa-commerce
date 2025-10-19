import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { 
  Product, 
  ProductVariant, 
  ProductImage,
  Price,
  Cart, 
  LineItem,
  Order,
  Payment,
  Customer,
  InventoryItem,
  Job,
  Region
} = tables;

// ==========================================
// PRODUCT RESOURCES
// ==========================================

export class ProductResource extends Product {
  static loadAsInstance = false;
  
  async search(query) {
    const { 
      limit = 20, 
      offset = 0, 
      q, 
      status = 'published' 
    } = query;
    
    let conditions = [
      { attribute: 'status', comparator: 'eq', value: status }
    ];
    
    if (q) {
      conditions.push({
        attribute: 'title',
        comparator: 'contains',
        value: q
      });
    }
    
    const products = await super.search({
      conditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      select: ['*', 'variants.*', 'variants.prices.*', 'images.*']
    });
    
    return products;
  }
  
  async get(target) {
    target.checkPermissions = false;
    
    const product = await super.get(target, {
      select: [
        '*', 
        'variants.*', 
        'variants.prices.*',
        'options.*',
        'images.*'
      ]
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
  
  async post(target, data) {
    const context = this.getContext();
    if (!context.user || context.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    const product = await super.create({
      title: data.title,
      description: data.description,
      handle: data.handle || slugify(data.title),
      status: data.status || 'draft',
      thumbnail: data.thumbnail,
      metadata: data.metadata
    });
    
    if (data.variants) {
      for (const variantData of data.variants) {
        const variant = await ProductVariant.create({
          productId: product.id,
          title: variantData.title,
          sku: variantData.sku,
          inventoryQuantity: variantData.inventoryQuantity || 0,
          manageInventory: variantData.manageInventory || true
        });
        
        if (variantData.prices) {
          for (const priceData of variantData.prices) {
            await Price.create({
              variantId: variant.id,
              amount: priceData.amount,
              currencyCode: priceData.currencyCode,
              regionId: priceData.regionId
            });
          }
        }
        
        await InventoryItem.create({
          sku: variant.sku,
          variantId: variant.id,
          quantity: variantData.inventoryQuantity || 0,
          reservedQuantity: 0
        });
      }
    }
    
    if (data.images) {
      for (const imageUrl of data.images) {
        await ProductImage.create({
          productId: product.id,
          url: imageUrl
        });
      }
    }
    
    return await this.get({ id: product.id });
  }
  
  async put(target, data) {
    const context = this.getContext();
    if (!context.user || context.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    const record = this.update(target);
    Object.assign(record, data);
    
    return record;
  }
}

// ==========================================
// CART RESOURCES
// ==========================================

export class CartResource extends Cart {
  static loadAsInstance = false;
  
  async post(target, data) {
    const { regionId, email } = data;
    
    let region = await Region.get(regionId);
    if (!region) {
      const regions = await Region.search({
        conditions: [{ attribute: 'currencyCode', comparator: 'eq', value: 'USD' }]
      });
      region = regions[0];
    }
    
    const cart = await super.create({
      regionId: region.id,
      email,
      subtotal: 0,
      tax: 0,
      total: 0
    });
    
    return cart;
  }
  
  async get(target) {
    target.checkPermissions = false;
    
    const cart = await super.get(target, {
      select: [
        '*',
        'items.*',
        'items.variant.*',
        'items.variant.product.*',
        'items.variant.product.images.*',
        'region.*'
      ]
    });
    
    return cart;
  }
}

// ==========================================
// CART ITEM RESOURCE
// ==========================================

export class CartItemResource extends Resource {
  async post(target, data) {
    const { cartId, variantId, quantity } = data;
    
    const cart = await Cart.get(cartId);
    if (!cart || cart.completedAt) {
      throw new Error('Invalid cart');
    }
    
    const variant = await ProductVariant.get(variantId, {
      select: ['*', 'prices.*', 'product.*']
    });
    
    if (!variant) {
      throw new Error('Variant not found');
    }
    
    const price = variant.prices.find(p => p.regionId === cart.regionId);
    
    if (!price) {
      throw new Error('Price not available in region');
    }
    
    const lineItem = await LineItem.create({
      cartId,
      variantId,
      title: variant.product.title,
      quantity,
      unitPrice: price.amount,
      subtotal: price.amount * quantity,
      total: price.amount * quantity
    });
    
    await this.recalculateCart(cartId);
    
    return await Cart.get(cartId, {
      select: ['*', 'items.*', 'items.variant.*']
    });
  }
  
  async put(target, data) {
    const { quantity } = data;
    const lineItem = this.update(target);
    
    lineItem.quantity = quantity;
    lineItem.subtotal = lineItem.unitPrice * quantity;
    lineItem.total = lineItem.subtotal;
    
    await this.recalculateCart(lineItem.cartId);
    
    return lineItem;
  }
  
  async delete(target) {
    const lineItem = await LineItem.get(target.id);
    const cartId = lineItem.cartId;
    
    await super.delete(target);
    await this.recalculateCart(cartId);
    
    return { success: true };
  }
  
  async recalculateCart(cartId) {
    const items = await LineItem.search({
      conditions: [{ attribute: 'cartId', comparator: 'eq', value: cartId }]
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const cart = Cart.update({ id: cartId });
    cart.subtotal = subtotal;
    cart.tax = tax;
    cart.total = total;
  }
}

// ==========================================
// CHECKOUT RESOURCE
// ==========================================

export class CheckoutResource extends Resource {
  async post(target, data) {
    const { 
      cartId, 
      paymentMethod,
      shippingAddress,
      billingAddress 
    } = data;
    
    try {
      const cart = await Cart.get(cartId, {
        select: ['*', 'items.*', 'items.variant.*', 'customer.*', 'region.*']
      });
      
      if (!cart || cart.completedAt) {
        throw new Error('Invalid cart');
      }
      
      for (const item of cart.items) {
        const inventory = await InventoryItem.search({
          conditions: [
            { attribute: 'variantId', comparator: 'eq', value: item.variantId }
          ]
        });
        
        if (inventory[0].quantity < item.quantity) {
          throw new Error(`Insufficient inventory for ${item.title}`);
        }
        
        const inv = InventoryItem.update({ id: inventory[0].id });
        inv.reservedQuantity += item.quantity;
      }
      
      const order = await Order.create({
        customerId: cart.customerId,
        cartId,
        regionId: cart.regionId,
        email: cart.email,
        status: 'pending',
        paymentStatus: 'awaiting',
        fulfillmentStatus: 'not_fulfilled',
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        shippingAddress,
        billingAddress
      });
      
      for (const item of cart.items) {
        const lineItem = LineItem.update({ id: item.id });
        lineItem.orderId = order.id;
      }
      
      const paymentResult = await this.processPayment({
        amount: cart.total,
        currency: cart.region.currencyCode,
        method: paymentMethod,
        orderId: order.id
      });
      
      await Payment.create({
        orderId: order.id,
        amount: cart.total,
        currencyCode: cart.region.currencyCode,
        provider: paymentMethod,
        status: paymentResult.status,
        providerId: paymentResult.id
      });
      
      for (const item of cart.items) {
        const inventory = await InventoryItem.search({
          conditions: [
            { attribute: 'variantId', comparator: 'eq', value: item.variantId }
          ]
        });
        
        const inv = InventoryItem.update({ id: inventory[0].id });
        inv.quantity -= item.quantity;
        inv.reservedQuantity -= item.quantity;
      }
      
      const cartRecord = Cart.update({ id: cartId });
      cartRecord.completedAt = new Date();
      
      const orderRecord = Order.update({ id: order.id });
      orderRecord.status = 'confirmed';
      orderRecord.paymentStatus = 'captured';
      
      await Job.create({
        type: 'send_email',
        status: 'pending',
        payload: {
          orderId: order.id,
          type: 'order_confirmation'
        },
        maxAttempts: 3,
        attempts: 0
      });
      
      return await Order.get(order.id, {
        select: ['*', 'items.*', 'payments.*']
      });
      
    } catch (error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
  }
  
  async processPayment({ amount, currency, method, orderId }) {
    return {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      status: 'succeeded'
    };
  }
}

// ==========================================
// CUSTOMER AUTH
// ==========================================

export class CustomerAuthResource extends Resource {
  async post(target, data) {
    if (data.action === 'register') {
      const { email, password, firstName, lastName } = data;
      
      const existing = await Customer.search({
        conditions: [
          { attribute: 'email', comparator: 'eq', value: email }
        ]
      });
      
      if (existing.length > 0) {
        throw new Error('Email already registered');
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const customer = await Customer.create({
        email,
        passwordHash,
        firstName,
        lastName
      });
      
      const token = jwt.sign(
        { customerId: customer.id, email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      
      return { 
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName
        },
        token 
      };
    }
    
    if (data.action === 'login') {
      const { email, password } = data;
      
      const customers = await Customer.search({
        conditions: [
          { attribute: 'email', comparator: 'eq', value: email }
        ]
      });
      
      if (customers.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const customer = customers[0];
      const valid = await bcrypt.compare(password, customer.passwordHash);
      
      if (!valid) {
        throw new Error('Invalid credentials');
      }
      
      const token = jwt.sign(
        { customerId: customer.id, email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      
      return { 
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName
        },
        token 
      };
    }
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

