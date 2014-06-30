var CreateOrders = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('count', 'int');
          t.column('status', 'string');
	  t.column('place_id', 'string');
	  t.column('ware_id', 'string');
	  t.column('user_id', 'string');
          t.column('group', 'string');
	  t.column('executor_user_id', 'string');
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
