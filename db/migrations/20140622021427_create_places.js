var CreatePlaces = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('location', 'string');
          t.column('group', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('place', def, callback);
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
    this.dropTable('place', callback);
  };
};

exports.CreatePlaces = CreatePlaces;
