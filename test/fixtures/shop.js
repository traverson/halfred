'use strict';

exports.get = function() {
  return {
    _links: {
      self: { href: '/orders' },
      next: { href: '/orders?page=2' },
      find: { href: '/orders{?id}', templated: true },
      admin: [
        { href: '/admins/2', title: 'Fred' },
        { href: '/admins/5', title: 'Kate' }
      ]
    },
    currentlyProcessing: 14,
    shippedToday: 20,
    _embedded: {
      orders: [{
        _links: {
          self: { href: '/orders/123' },
          basket: { href: '/baskets/98712' },
          customer: { href: '/customers/7809' }
        },
        total: 30.00,
        currency: 'USD',
        status: 'shipped'
      },{
        _links: {
          self: { href: '/orders/124' },
          basket: { href: '/baskets/97213' },
          customer: { href: '/customers/12369' }
        },
        total: 20.00,
        currency: 'USD',
        status: 'processing'
      }]
    }
  }
}
