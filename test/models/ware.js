var assert = require('assert')
  , tests
  , Ware = geddy.model.Ware;

tests = {

  'after': function (next) {
    // cleanup DB
    Ware.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var ware = Ware.create({});
    ware.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
