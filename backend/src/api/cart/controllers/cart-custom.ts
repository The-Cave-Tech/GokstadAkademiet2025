/**
 * Custom controller for cart operations
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
  /**
   * Get the current user's cart
   */
  async getMyCart(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å se handlekurven');
    }

    try {
      // Find cart for the current user
      const carts = await strapi.db.query('api::cart.cart').findMany({
        where: { user: user.id },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });
      
      if (!carts || carts.length === 0) {
        // Return empty cart if not found
        return {
          id: null,
          items: [],
          subtotal: 0,
          total: 0,
          user: user.id
        };
      }
      
      return carts[0];
    } catch (err) {
      return ctx.badRequest('Kunne ikke hente handlekurven', { error: err.message });
    }
  },

  /**
   * Add an item to the cart
   */
  async addItem(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å legge til produkter i handlekurven');
    }

    const { productId, quantity = 1 } = ctx.request.body;
    
    if (!productId) {
      return ctx.badRequest('Produkt-ID er påkrevd');
    }

    try {
      // Find the product
      const product = await strapi.db.query('api::product.product').findOne({
        where: { id: productId },
      });
      
      if (!product) {
        return ctx.notFound('Produktet ble ikke funnet');
      }
      
      // Check if product is in stock
      if (product.stock < quantity) {
        return ctx.badRequest('Ikke nok på lager');
      }

      // Find or create a cart for the user
      let cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: user.id },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });
      
      if (!cart) {
        // Create new cart
        cart = await strapi.entityService.create('api::cart.cart', {
          data: {
            user: user.id,
            items: [],
            subtotal: 0,
            total: 0
          }
        });
        
        // Reload with items
        cart = await strapi.db.query('api::cart.cart').findOne({
          where: { id: cart.id },
          populate: {
            items: {
              populate: ['product']
            }
          }
        });
      }

      // Check if product already exists in cart
      const existingItemIndex = cart.items ? cart.items.findIndex(item => 
        item.product && item.product.id === Number(productId)
      ) : -1;

      // Calculate item subtotal
      const price = product.discountedPrice || product.price;
      const itemSubtotal = price * quantity;

      let updatedItems = [...(cart.items || [])];
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Check if updated quantity is in stock
        if (product.stock < newQuantity) {
          return ctx.badRequest('Ikke nok på lager for ønsket antall');
        }
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          subtotal: price * newQuantity
        };
      } else {
        // Add new item
        updatedItems.push({
          product: productId,
          quantity,
          price,
          subtotal: itemSubtotal
        });
      }

      // Recalculate cart totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      // Update cart
      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: {
          items: updatedItems,
          subtotal,
          total: subtotal // For now, total equals subtotal. Later you can add shipping, etc.
        },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Kunne ikke legge til i handlekurven', { error: err.message });
    }
  },

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å oppdatere handlekurven');
    }

    const { itemIndex } = ctx.params;
    const { quantity } = ctx.request.body;
    
    if (quantity < 1) {
      return ctx.badRequest('Antall må være minst 1');
    }

    try {
      // Find the cart
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: user.id },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });
      
      if (!cart) {
        return ctx.notFound('Handlekurven ble ikke funnet');
      }

      // Check if item exists
      if (!cart.items || !cart.items[itemIndex]) {
        return ctx.notFound('Produktet ble ikke funnet i handlekurven');
      }

      const item = cart.items[itemIndex];
      
      // Find the product to check stock
      const product = await strapi.db.query('api::product.product').findOne({
        where: { id: item.product.id },
      });
      
      if (!product) {
        return ctx.notFound('Produktet ble ikke funnet');
      }
      
      // Check if product is in stock
      if (product.stock < quantity) {
        return ctx.badRequest('Ikke nok på lager');
      }

      // Update quantity and subtotal
      let updatedItems = [...cart.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: quantity,
        subtotal: item.price * quantity
      };

      // Recalculate cart totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      // Update cart
      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: {
          items: updatedItems,
          subtotal,
          total: subtotal
        },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Kunne ikke oppdatere handlekurven', { error: err.message });
    }
  },

  /**
   * Remove an item from the cart
   */
  async removeItem(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å fjerne produkter fra handlekurven');
    }

    const { itemIndex } = ctx.params;

    try {
      // Find the cart
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: user.id },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });
      
      if (!cart) {
        return ctx.notFound('Handlekurven ble ikke funnet');
      }

      // Check if item exists
      if (!cart.items || !cart.items[itemIndex]) {
        return ctx.notFound('Produktet ble ikke funnet i handlekurven');
      }

      // Remove the item
      let updatedItems = [...cart.items];
      updatedItems.splice(itemIndex, 1);

      // Recalculate cart totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      // Update cart
      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: {
          items: updatedItems,
          subtotal,
          total: subtotal
        },
        populate: {
          items: {
            populate: ['product']
          }
        }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Kunne ikke fjerne produkt fra handlekurven', { error: err.message });
    }
  },

  /**
   * Clear the cart
   */
  async clearCart(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å tømme handlekurven');
    }

    try {
      // Find the cart
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: user.id }
      });
      
      if (!cart) {
        return ctx.notFound('Handlekurven ble ikke funnet');
      }

      // Update cart with empty items and zero totals
      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: {
          items: [],
          subtotal: 0,
          total: 0
        }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Kunne ikke tømme handlekurven', { error: err.message });
    }
  }
}));