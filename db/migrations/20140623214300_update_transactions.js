var UpdateTransactions = function () {
  this.up = function (next) {
    this.addColumn('transaction','placeId', 'int', function(err, data){
       this.addColumn('transaction','wareId', 'int',function(err, data){
         this.addColumn('transaction','creatorId', 'int', function(err, data){
           this.addColumn('transaction','pairId', 'int', function(err, data){next();});
         });
       });
    });
  };

  this.down = function (next) {
    this.removeColumn('transaction','placeId',  function(err, data){
       this.removeColumn('transaction','wareId', function(err, data){
         this.removeColumn('transaction','creatorId', function(err, data){
           this.removeColumn('transaction','pairId', function(err, data){next();});
        });
      });
    });
  };
};

exports.UpdateTransactions = UpdateTransactions;
