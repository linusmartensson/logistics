var assert = require('assert')
  , tests
  , Place = geddy.model.Place;

tests = {

  'after': function (next) {
    // cleanup DB
    Place.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var place = Place.create({});
    place.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
