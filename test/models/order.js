var assert = require('assert')
  , tests
  , Order = geddy.model.Order;

tests = {

  'after': function (next) {
    // cleanup DB
    Order.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var order = Order.create({});
    order.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
