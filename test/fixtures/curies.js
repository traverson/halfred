'use strict';

exports.get = function() {
  return {
    _links: {
      self: { href: '/orders' },
      curies: [{
        name: 'curie1',
        href: 'http://docs.example.com/relations/{rel}',
        templated: true
      }, {
        name: 'curie2',
        href: 'http://docs.example.com/relations/curie2',
      }],
      'curie1:value': { href: '/link' },
      'curie2:value': { href: '/link' },
    }
  };
};
