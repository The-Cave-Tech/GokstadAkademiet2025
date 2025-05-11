export default {
  routes: [
    // Create order
    {
      method: 'POST',
      path: '/orders',
      handler: 'order-custom.createOrder',
      config: {
        policies: []
      }
    },
    // Get my orders
    {
      method: 'GET',
      path: '/orders/my-orders',
      handler: 'order-custom.getMyOrders',
      config: {
        policies: []
      }
    },
    // Get specific order
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'order-custom.getOrderById',
      config: {
        policies: []
      }
    },
    // Cancel order
    {
      method: 'PUT',
      path: '/orders/:id/cancel',
      handler: 'order-custom.cancelOrder',
      config: {
        policies: []
      }
    }
  ]
};