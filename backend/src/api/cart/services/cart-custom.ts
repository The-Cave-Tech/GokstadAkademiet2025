/**
 * Custom service for cart operations
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::cart.cart', ({ strapi }) => ({
  /**
   * Calculate cart totals
   * @param {Array} items - Cart items
   * @returns {Object} - Subtotal and total
   */
  calculateCartTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // For now, total equals subtotal
    // Later you can add shipping, taxes, discounts, etc.
    const total = subtotal;
    
    return { subtotal, total };
  },

  /**
   * Get user's cart or create one if it doesn't exist
   * @param {number} userId - User ID
   * @returns {Object} - Cart object
   */
  async getOrCreateCart(userId) {
    // Find user's cart
    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { user: userId },
      populate: {
        items: {
          populate: ['product']
        }
      }
    });
    
    if (cart) {
      return cart;
    }
    
    // Create a new cart if none exists
    const newCart = await strapi.entityService.create('api::cart.cart', {
      data: {
        user: userId,
        items: [],
        subtotal: 0,
        total: 0
      },
      populate: {
        items: {
          populate: ['product']
        }
      }
    });
    
    return newCart;
  }
}));