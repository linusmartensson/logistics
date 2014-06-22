var CreateTransactions = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('timestamp', 'datetime');
          t.column('count', 'int');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('transaction', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('transaction', callback);
  };
};

exports.CreateTransactions = CreateTransactions;
