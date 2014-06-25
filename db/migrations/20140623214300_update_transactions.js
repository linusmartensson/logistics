var UpdateTransactions = function () {
  this.up = function (next) {
    var tt = this;
    tt.addColumn('transactions','placeId', 'int', function(err, data){
      tt.addColumn('transactions','wareId', 'int',function(err, data){
        tt.addColumn('transactions','userId', 'int', function(err, data){
          tt.addColumn('transactions','pairId', 'int', function(err, data){next();});
        });
      });
    });
  };

  this.down = function (next) {
    var tt = this;
    tt.removeColumn('transactions','placeId',  function(err, data){
      tt.removeColumn('transactions','wareId', function(err, data){
        tt.removeColumn('transactions','userId', function(err, data){
          tt.removeColumn('transactions','pairId', function(err, data){next();});
        });
      });
    });
  };
};

exports.UpdateTransactions = UpdateTransactions;
