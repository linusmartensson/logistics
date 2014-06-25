var UpdateOrders = function () {
  this.up = function (next) {
    var tt = this;
    tt.addColumn('orders','placeId', 'int', function(err, data){
      tt.addColumn('orders','wareId', 'int',function(err, data){
        tt.addColumn('orders','userId', 'int', function(err, data){
          tt.addColumn('orders','executorId', 'int', function(err, data){
            next();
          });
        });
      });
    });
  };

  this.down = function (next) {
    var tt = this;
    tt.removeColumn('orders','placeId',  function(err, data){
      tt.removeColumn('orders','wareId', function(err, data){
        tt.removeColumn('orders','userId', function(err, data){
          tt.removeColumn('orders','executorId', function(err, data){
            next();
          });
        });
      });
    });
  };
};

exports.UpdateOrders = UpdateOrders;
