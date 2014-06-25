'use strict';

exports.get = function() {
  return {
    property: 'value',
    _embedded: {
      'an_embedded_resource': {
        what: 'ever'
      }
    }
  };
};
