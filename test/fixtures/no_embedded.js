'use strict';

exports.get = function() {
  return {
    _links: {
      self: { href: '/self' }
    },
    property: 'value'
  };
};
