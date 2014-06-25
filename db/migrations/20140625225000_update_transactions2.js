var UpdateTransactions2 = function () {
  this.up = function (next) {
    var tt = this;
    tt.addColumn('transactions','creatorId', 'userId', function(err, data){
      next();
    });
  };

  this.down = function (next) {
    var tt = this;
    tt.renameColumn('transactions','userId', 'creatorId', function(err, data){
      next();
    });
  };
};

exports.UpdateTransactions2 = UpdateTransactions2;
