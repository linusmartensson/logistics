var UpdateOrders = function () {
  this.up = function (next) {
    this.addColumn('order','placeId', 'int', function(err, data){
       this.addColumn('order','wareId', 'int',function(err, data){
         this.addColumn('order','creatorId', 'int', function(err, data){
         this.addColumn('order','executorId', 'int', function(err, data){
          next();
         });
         });
       });
    });
  };

  this.down = function (next) {
    this.removeColumn('order','placeId',  function(err, data){
       this.removeColumn('order','wareId', function(err, data){
         this.removeColumn('order','creatorId', function(err, data){
         this.removeColumn('order','executorId', function(err, data){
          next();
        });
        });
      });
    });
  };
};

exports.UpdateOrders = UpdateOrders;
