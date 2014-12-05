'use strict';

exports.get = function() {
  return {
    _links: {
      self: { href: '/self' },
      primitive: '/links-must-be-objects',
    }
  };
};
