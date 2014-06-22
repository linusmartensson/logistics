var assert = require('assert')
  , tests
  , Transaction = geddy.model.Transaction;

tests = {

  'after': function (next) {
    // cleanup DB
    Transaction.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var transaction = Transaction.create({});
    transaction.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
