var CreateWares = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('orderno', 'string');
          t.column('packaging', 'string');
          t.column('price', 'number');
          t.column('storage', 'string');
          t.column('position', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('ware', def, callback);
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
    this.dropTable('ware', callback);
  };
};

exports.CreateWares = CreateWares;
