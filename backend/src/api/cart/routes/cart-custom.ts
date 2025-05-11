export default {
  routes: [
    {
      method: 'GET',
      path: '/carts/me',
      handler: 'cart-custom.getMyCart',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/carts/items',
      handler: 'cart-custom.addItem',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/carts/items/:itemIndex',
      handler: 'cart-custom.updateItemQuantity',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/carts/items/:itemIndex',
      handler: 'cart-custom.removeItem',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/carts/clear',
      handler: 'cart-custom.clearCart',
      config: {
        policies: []
      }
    }
  ]
};