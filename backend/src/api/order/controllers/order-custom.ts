'use strict';

/**
 * Custom order controller for Strapi 5
 */
export default {
  /**
   * Create a new order
   */
  async createOrder(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å fullføre en bestilling');
    }
    
    const { data } = ctx.request.body;
    
    if (!data || !data.items || !data.shippingInfo) {
      return ctx.badRequest('Bestillingsdata mangler');
    }
    
    try {
      // Generate an order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create the order - med type assertion for å unngå TypeScript-feil
      const order = await strapi.entityService.create('api::order.order' as any, {
        data: {
          ...data,
          orderNumber,
          status: 'pending',
          user: user.id,
          // Bruk ISO string-format for datoer istedenfor Date-objekt
          createdAt: new Date().toISOString(),
        },
      });
      
      // Clear the user's cart after successful order
      const cart = await strapi.db.query('api::cart.cart' as any).findOne({
        where: { user: user.id }
      });
      
      if (cart) {
        await strapi.entityService.update('api::cart.cart' as any, cart.id, {
          data: {
            // Bruk en tom array litteral istedenfor undefined[]
            items: [] as any,
            subtotal: 0,
            total: 0
          }
        });
      }
      
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      return ctx.badRequest('Kunne ikke fullføre bestillingen', { error: err?.message });
    }
  },
  
  /**
   * Get orders for the current logged-in user
   */
  async getMyOrders(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å se dine bestillinger');
    }
    
    try {
      const orders = await strapi.db.query('api::order.order' as any).findMany({
        where: { user: user.id },
        orderBy: { createdAt: 'DESC' },
        populate: ['items', 'shippingInfo']
      });
      
      return orders;
    } catch (err) {
      console.error('Error fetching orders:', err);
      return ctx.badRequest('Kunne ikke hente dine bestillinger', { error: err?.message });
    }
  },
  
  /**
   * Get a specific order by ID
   */
  async getOrderById(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å se bestillinger');
    }
    
    try {
      const order = await strapi.db.query('api::order.order' as any).findOne({
        where: { id, user: user.id },
        populate: ['items', 'items.product', 'shippingInfo']
      });
      
      if (!order) {
        return ctx.notFound('Bestillingen ble ikke funnet');
      }
      
      return order;
    } catch (err) {
      console.error('Error fetching order:', err);
      return ctx.badRequest('Kunne ikke hente bestillingen', { error: err?.message });
    }
  },
  
  /**
   * Cancel an order (if still possible)
   */
  async cancelOrder(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Du må være logget inn for å kansellere bestillinger');
    }
    
    try {
      const order = await strapi.db.query('api::order.order' as any).findOne({
        where: { id, user: user.id }
      });
      
      if (!order) {
        return ctx.notFound('Bestillingen ble ikke funnet');
      }
      
      // Check if order can be canceled
      if (['completed', 'shipped', 'delivered'].includes(order.status)) {
        return ctx.badRequest('Bestillingen kan ikke kanselleres i nåværende status');
      }
      
      // Update order status
      const updatedOrder = await strapi.entityService.update('api::order.order' as any, id, {
        data: {
          status: 'canceled',
          // Bruk ISO string-format for datoer
          updatedAt: new Date().toISOString(),
        }
      });
      
      return updatedOrder;
    } catch (err) {
      console.error('Error canceling order:', err);
      return ctx.badRequest('Kunne ikke kansellere bestillingen', { error: err?.message });
    }
  }
};