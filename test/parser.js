'use strict';

var halfred = require('../halfred')
  , fixtures = require('./fixtures')
  , chai = require('chai')
  , expect = chai.expect
  , assert = chai.assert;

describe('Parsing HAL', function() {

  afterEach(function() {
    halfred.disableValidation();
  });

  it('should parse the minimal example fixture', function() {
    var unparsed = fixtures.minimal.get();
    var resource = halfred.parse(unparsed);

    expect(resource.allLinkArrays()).to.exist;
    expect(resource.allLinkArrays()).to.be.an('object');
    expect(resource.allLinkArrays().self[0]).to.exist;
    expect(resource.allLinkArrays().self[0].href).to.exist;
    expect(resource.allLinkArrays().self[0].href).to.equal('dummy');
    expect(resource.linkArray('self')).to.exist;
    expect(resource.linkArray('self')).to.be.an('array');
    expect(resource.linkArray('self')[0]).to.exist;
    expect(resource.linkArray('self')[0].href).to.exist;
    expect(resource.linkArray('self')[0].href).to.equal('dummy');
    expect(resource.link('self')).to.exist;
    expect(resource.link('self')).to.be.an('object');
    expect(resource.link('self').href).to.exist;
    expect(resource.link('self').href).to.equal('dummy');
  });

  it('should not modify the source object', function() {
    var unparsed = fixtures.minimal.get();
    var resource = halfred.parse(unparsed);

    expect(unparsed._links.self).to.not.be.an('array');
    expect(unparsed._links.self).to.be.an('object');
    expect(unparsed._links.self.href).to.exist;
    expect(unparsed._links.self.templated).to.not.exist;
    expect(unparsed._embedded).to.not.exist;
    expect(unparsed._validation).to.not.exist;

    expect(resource._links.self).to.be.an('array');
    expect(resource._links.self).to.not.be.an('object');
    expect(resource._links.self[0].templated).to.exist;
    expect(resource._links.self[0].templated).to.be.false;
    expect(resource._embedded).to.exist;
    expect(resource._embedded).to.be.an('object');
    expect(resource._validation).to.exist;
    expect(resource._validation).to.be.an('array');
  });

  it('should parse the standard HAL example - main links', function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);

    expect(resource.allLinkArrays()).to.exist;
    expect(resource.link('self').href).to.equal('/orders');
    expect(resource.link('self').templated).to.be.false;
    expect(resource.link('next').href).to.equal('/orders?page=2');
    expect(resource.link('find').href).to.equal('/orders{?id}');
    expect(resource.link('find').templated).to.be.true;
  });

  it('should parse the standard HAL example - admin links', function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);

    expect(resource.allLinkArrays()).to.exist;
    expect(resource.linkArray('admin')).to.exist;
    expect(resource.linkArray('admin')).to.be.an('array');
    expect(resource.linkArray('admin').length).to.equal(2);
    expect(resource.linkArray('admin')[0].href).to.equal('/admins/2');
    expect(resource.linkArray('admin')[0].title).to.equal('Fred');
    expect(resource.linkArray('admin')[1].href).to.equal('/admins/5');
    expect(resource.linkArray('admin')[1].title).to.equal('Kate');
    expect(resource.link('admin').href).to.equal('/admins/2');
    expect(resource.link('admin').title).to.equal('Fred');
    expect(resource.link('admin', 0).href).to.equal('/admins/2');
    expect(resource.link('admin', 0).title).to.equal('Fred');
    expect(resource.link('admin', 1).href).to.equal('/admins/5');
    expect(resource.link('admin', 1).title).to.equal('Kate');
  });

  it('should parse the standard HAL example - properties', function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);

    expect(resource.allLinkArrays()).to.exist;
    expect(resource.currentlyProcessing).to.equal(14);
    expect(resource.shippedToday).to.equal(20);
  });

  it('should parse the standard HAL example - embedded resources', function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);

    expect(resource.allLinkArrays()).to.exist;
    expect(resource.allEmbeddedResourceArrays()).to.exist;
    expect(resource.allEmbeddedResourceArrays()).to.be.an('object');
    var orders = resource.embeddedResourceArray('orders');
    expect(orders).to.exist;
    expect(orders).to.be.an('array');
    expect(orders.length).to.equal(2);
    var order1 = resource.embedded('orders');
    var order2 = resource.embedded('orders', 1);
    expect(orders[0]).to.deep.equal(order1);
    expect(orders[1]).to.deep.equal(order2);

    expect(order1.allLinkArrays()).to.exist;
    expect(order1.allLinkArrays()).to.be.an('object');
    expect(order1.allLinkArrays().self[0]).to.exist;
    expect(order1.allLinkArrays().self[0].href).to.exist;
    expect(order1.linkArray('self')).to.exist;
    expect(order1.linkArray('self')).to.be.an('array');
    expect(order1.linkArray('self')[0]).to.exist;
    expect(order1.linkArray('self')[0].href).to.exist;

    expect(order1.link('self').href).to.equal('/orders/123');
    expect(order1.link('self').href).to.equal('/orders/123');
    expect(order1.link('basket').href).to.equal('/baskets/98712');
    expect(order1.link('customer').href).to.equal('/customers/7809');
    expect(order1.total).to.equal(30);
    expect(order1.currency).to.equal('USD');
    expect(order1.status).to.equal('shipped');

    expect(order2.link('self').href).to.equal('/orders/124');
    expect(order2.link('basket').href).to.equal('/baskets/97213');
    expect(order2.link('customer').href).to.equal('/customers/12369');
    expect(order2.total).to.equal(20);
    expect(order2.currency).to.equal('USD');
    expect(order2.status).to.equal('processing');
  });

  it('should not modify the embedded resources in the source object',
      function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);

    expect(unparsed._links.self).to.not.be.an('array');
    expect(unparsed._links.self).to.be.an('object');
    expect(unparsed._links.self.templated).to.not.exist;
    expect(unparsed._links.next).to.not.be.an('array');
    expect(unparsed._links.next).to.be.an('object');
    expect(unparsed._links.next.templated).to.not.exist;
    expect(unparsed._links.admin).to.be.an('array');
    expect(unparsed._links.find.templated).to.be.true;
    expect(unparsed.currentlyProcessing).to.equal(14);
    expect(unparsed._embedded).to.exist;
    expect(unparsed._validation).to.not.exist;

    expect(unparsed._embedded.orders[0]._links.self).to.not.be.an('array');
    expect(unparsed._embedded.orders[0]._links.self).to.be.an('object');
    expect(unparsed._embedded.orders[0]._links.self.templated).to.not.exist;
    expect(unparsed._embedded.orders[1]._links.basket).to.not.be.an('array');
    expect(unparsed._embedded.orders[1]._links.basket).to.be.an('object');
    expect(unparsed._embedded.orders[1]._links.basket.templated).to.not.exist;
    expect(unparsed._embedded.orders[0]._embedded).to.not.exist;
    expect(unparsed._embedded.orders[0]._validation).to.not.exist;
    expect(unparsed._embedded.orders[1]._embedded).to.not.exist;
    expect(unparsed._embedded.orders[1]._validation).to.not.exist;

    expect(resource._links.self).to.be.an('array');
    expect(resource._links.next).to.be.an('array');
    expect(resource._validation).to.exist;
    expect(resource._validation).to.be.an('array');

    expect(resource._embedded.orders[0]._links.self).to.be.an('array');
    expect(resource._embedded.orders[1]._links.basket).to.be.an('array');
    expect(resource._embedded.orders[0]._embedded).to.be.an('object');
    expect(resource._embedded.orders[0]._validation).to.be.an('array');
    expect(resource._embedded.orders[1]._embedded).to.be.an('object');
    expect(resource._embedded.orders[1]._validation).to.be.an('array');
  });

  it('should store the original source object in the resource',
      function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);
    expect(resource.original())
       .to.deep.equal(unparsed);
    expect(resource.embedded('orders', 1).original())
       .to.deep.equal(unparsed._embedded.orders[1]);
  });

  it('should parse curies', function() {
    var unparsed = fixtures.curies.get();
    var resource = halfred.parse(unparsed);
    expect(resource.hasCuries()).to.be.true;
    expect(resource.curieArray()).to.exist;
    expect(resource.curieArray()).to.be.an('array');
    expect(resource.curieArray().length).to.equal(2);
    var fullUrl1 = resource.curie('curie1');
    expect(fullUrl1.name).to.equal('curie1');
    expect(fullUrl1.templated).to.equal.true;
    expect(fullUrl1.href).to.equal('http://docs.example.com/relations/{rel}');
    var fullUrl2 = resource.curie('curie2');
    expect(fullUrl2.name).to.equal('curie2');
    expect(fullUrl2.templated).to.be.false;
    expect(fullUrl2.href).to.equal('http://docs.example.com/relations/curie2');
  });

  it('should recognize that there are no curies', function() {
    var unparsed = fixtures.shop.get();
    var resource = halfred.parse(unparsed);
    expect(resource.hasCuries()).to.be.false;
    expect(resource.curieArray()).to.be.an('array');
    expect(resource.curieArray().length).to.equal(0);
    expect(resource.curie('whatever')).to.not.exist;
  });

  it('should reverse resolve non-templated curies', function() {
    var unparsed = fixtures.curies.get();
    var resource = halfred.parse(unparsed);
    var curie = resource.reverseResolveCurie(
      'http://docs.example.com/relations/curie2');
    expect(curie).to.equal('curie2');
  });

  it('should reverse resolve templated curies', function() {
    var unparsed = fixtures.curies.get();
    var resource = halfred.parse(unparsed);
    var curie = resource.reverseResolveCurie(
      'http://docs.example.com/relations/value');
    expect(curie).to.equal('curie1:value');
  });

  it('should reverse resolve to null/undefined if curie url does not ' +
      'exist', function() {
    var unparsed = fixtures.curies.get();
    var resource = halfred.parse(unparsed);
    var curie = resource.reverseResolveCurie(
      'http://docs.example.com/does/not/exist');
    expect(curie).to.not.exist;
  });

  it('should reverse resolve to null/undefined if there is no templated ' +
      ' match', function() {
    var unparsed = fixtures.curies.get();
    var resource = halfred.parse(unparsed);
    var curie = resource.reverseResolveCurie(
      'http://docs.example.com/relations/doesnotexist');
    expect(curie).to.not.exist;
  });

  it('should parse a resource without links', function() {
    var unparsed = fixtures.noLinks.get();
    var resource = halfred.parse(unparsed);

    // check that allLinkArrays() returns an empty object
    var allLinkArrays = resource.allLinkArrays();
    expect(allLinkArrays).to.exist;
    Object.keys(allLinkArrays).forEach(function(key) {
      assert.fail();
    });

    // check that linkArray('something')/link('something') returns
    // null/undefined instead of throwing an exception
    var nonExistingLinkArray = resource.linkArray('whatever');
    expect(nonExistingLink).to.not.exist;
    var nonExistingLink = resource.link('whatever');
    expect(nonExistingLink).to.not.exist;

    expect(resource.embedded('an_embedded_resource')).to.exist;
    expect(resource.property).to.equal('value');
  });

  it('should parse a resource without embedded resources', function() {
    var unparsed = fixtures.noEmbedded.get();
    var resource = halfred.parse(unparsed);

    // check that allEmbeddedArrays() returns an empty object
    var allEmbeddedArrays = resource.allEmbeddedArrays();
    expect(allEmbeddedArrays).to.exist;
    Object.keys(allEmbeddedArrays).forEach(function(key) {
      assert.fail();
    });

    // check that embeddedResourceArray('something')/
    // embeddedResource('something') returns null/undefined instead of throwing
    // an exception
    var nonExistingEmbeddedArray = resource.embeddedResourceArray('whatever');
    expect(nonExistingEmbeddedArray).to.not.exist;
    var nonExistingEmbeddedResource = resource.embeddedResource('whatever');
    expect(nonExistingEmbeddedResource).to.not.exist;

    expect(resource.link('self')).to.exist;
    expect(resource.property).to.equal('value');
  });

  it('should not report validation issues when validation is turned off',
      function() {
    var unparsed = fixtures.validation.get();
    var resource = halfred.parse(unparsed);
    checkInvalidResource(resource);
    expect(resource.validationIssues()).to.deep.equal([]);
    expect(resource.embedded('one').validationIssues()).to.deep.equal([]);
    expect(resource.embedded('two').validationIssues()).to.deep.equal([]);
  });

  it('should report validation issues when validation is turned on',
      function() {
    halfred.enableValidation();
    var unparsed = fixtures.validation.get();
    var resource = halfred.parse(unparsed);

    checkInvalidResource(resource);

    var validationRoot = resource.validationIssues();
    expect(validationRoot).to.be.an('array');
    expect(validationRoot.length).to.equal(5);
    expect(validationRoot[0].path).to.equal('$._links.first');
    expect(validationRoot[0].message).to.equal(
        'Link misses required property href.');
    expect(validationRoot[1].path).to.equal('$._links.uri-template-1');
    expect(validationRoot[1].message).to.equal('Link seems to be an URI ' +
        'template but its "templated" property is not set to true.');
    expect(validationRoot[2].path).to.equal('$._links.uri-template-2');
    expect(validationRoot[2].message).to.equal('Link seems to be an URI ' +
        'template but its "templated" property is not set to true.');
    expect(validationRoot[3].path).to.equal('$._links.uri-template-3');
    expect(validationRoot[3].message).to.equal('Link seems to be an URI ' +
        'template but its "templated" property is not set to true.');
    expect(validationRoot[4].path).to.equal('$._links');
    expect(validationRoot[4].message).to.equal('Resource does not have a ' +
        'self link');

    var validationOne = resource.embeddedResource('one').validationIssues();
    expect(validationOne).to.be.an('array');
    expect(validationOne.length).to.equal(1);
    expect(validationOne[0].path).to.equal('$._embedded.one._links');
    expect(validationOne[0].message).to.equal('Resource does not have a self ' +
        'link');

    var validationTwo = resource.embeddedResource('two').validationIssues();
    expect(validationTwo).to.be.an('array');
    expect(validationTwo.length).to.equal(0);
    /*
    TODO Implement validation for URIs/URI template syntax
    expect(validationTwo.length).to.equal(1)
    expect(validationTwo[0].path).to.equal('$._embedded.two._links.self')
    expect(validationTwo[0].message).to.equal('Attribute href is not a valid ' +
        'URI or URI template.')
    */
  });

  it('should report deprecation to log', function() {
    var unparsed = fixtures.deprecation.get();
    var resource = halfred.parse(unparsed);
    // Duh, how to check what is logged?! Currently we log to console.log :-(
  });

  it('should report primitive link objects correctly', function() {
    var unparsed = fixtures.primitiveLink.get();
    try {
      halfred.parse(unparsed);
      assert.fail();
    } catch (e) {
      expect(e.message).to.equal('Link object is not an actual object: ' +
        '/links-must-be-objects [string]');
    }
  });

  function checkInvalidResource(resource) {
    expect(resource.allLinkArrays()).to.exist;
    expect(resource.link('self')).to.not.exits;
    expect(resource.link('first')).to.exist;
    expect(resource.link('first').href).to.not.exist;
    expect(resource.link('second').type).to.exist;
    expect(resource.link('second').type).to.be.an('array');
    expect(resource.link('third').type).to.be.a('null');
    expect(resource.link('third').type).not.to.be.an('undefined');
  }
});
