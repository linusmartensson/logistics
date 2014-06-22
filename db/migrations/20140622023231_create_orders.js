var CreateOrders = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('createdat', 'datetime');
          t.column('completedat', 'datetime');
          t.column('count', 'int');
          t.column('status', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('order', def, callback);
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
    this.dropTable('order', callback);
  };
};

exports.CreateOrders = CreateOrders;
