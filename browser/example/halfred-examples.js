/* global halfred: true */
/* jshint -W101 */
(function() {
  'use strict';

  var rootUri = '/';

  function parseAll() {
    ['#minimal-result',
     '#another-result'].forEach(function(div) {
      $(div).html('<img src="assets/spinner.gif"/>');
    });
    parseMinimal();
    parseAnother();
  }

  var minimalSource = {
    _links: {
      self: {
        href: '/minimal'
      }
    },
    attribute: 'value'
  };

  var anotherSource = {
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
  };

  function parseMinimal() {
    $('#minimal-result').html('<img src="assets/spinner.gif"/>');
    var resource = halfred.parse(minimalSource);
    $('#minimal-result').html(
        'var resource = halfred.parse(halObject);\n\n' +
        'resource.link(\'self\'):\n' +
        JSON.stringify(resource.link('self'), null, 2) + '\n\n' +
        'resource.attribute: ' + resource.attribute
    );
  }

  function parseAnother() {
    $('#another-result').html('<img src="assets/spinner.gif"/>');
    var resource = halfred.parse(anotherSource);
    $('#another-result').html(
        'var resource = halfred.parse(halObject);\n\n' +
        'resource.link(\'self\'):\n' +
        JSON.stringify(resource.link('self'), null, 2) + '\n\n' +
        'resource.link(\'next\'):\n' +
        JSON.stringify(resource.link('next'), null, 2) + '\n\n' +
        'resource.link(\'find\'):\n' +
        JSON.stringify(resource.link('find'), null, 2) + '\n\n' +
        'resource.linkArray(\'admin\')[0]:\n' +
        JSON.stringify(resource.linkArray('admin')[0], null, 2) + '\n\n' +
        'resource.linkArray(\'admin\')[1]:\n' +
        JSON.stringify(resource.linkArray('admin')[1], null, 2) + '\n\n' +
        'resource.currentlyProcessing: ' + resource.currentlyProcessing + '\n\n' +
        'resource.shippedToday: ' + resource.shippedToday + '\n\n'+
        'resource.embeddedResourceArray(\'orders\')[0].link(\'self\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[0].link('self'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[0].link(\'basket\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[0].link('basket'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[0].link(\'customer\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[0].link('customer'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[0].total: ' + resource.embeddedResourceArray('orders')[0].total + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[0].currency: ' + resource.embeddedResourceArray('orders')[0].currency + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[0].status: ' + resource.embeddedResourceArray('orders')[0].status + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].link(\'self\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[1].link('self'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].link(\'basket\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[1].link('basket'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].link(\'customer\'):\n' +
        JSON.stringify(resource.embeddedResourceArray('orders')[1].link('customer'), null, 2) + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].total: ' + resource.embeddedResourceArray('orders')[1].total + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].currency: ' + resource.embeddedResourceArray('orders')[1].currency + '\n\n' +
        'resource.embeddedResourceArray(\'orders\')[1].status: ' + resource.embeddedResourceArray('orders')[1].status + '\n\n'
    );
  }

  $(document).ready(function () {
    $('#btn-all').on('click', parseAll);
    $('#btn-minimal').on('click', parseMinimal);
    $('#btn-another').on('click', parseAnother);

    $('#minimal-source').html('<pre>\n' +
      JSON.stringify(minimalSource, null, 2) +
      '\n</pre>');

    $('#another-source').html('<pre>\n' +
      JSON.stringify(anotherSource, null, 2) +
      '\n</pre>');
  });
})();
/* jshint +W101 */
