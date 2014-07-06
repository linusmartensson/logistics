var Transactions = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.buildData = function(next){
   geddy.model.Place.all(function(err, places) {
    geddy.model.Ware.all(function(err, wares) {
     for(var w in wares){
      wares[w].text = wares[w].name + ", " + wares[w].orderno + ", " + wares[w].price + ", " + wares[w].packaging + ", " + wares[w].storage;
      wares[w].value = wares[w].id;
     }
     for(var p in places){
      places[p].text = places[p].name + ", " + places[p].location;
      places[p].value = places[p].id;
     }
     next({wares:wares, places:places});
    });
   });
  };

  this.index = function (req, resp, params) {
   var self = this;
   q = {};
   o = {sort: {createdAt: 'asc'}, includes: ['places', 'wares']};
   geddy.model.Transaction.all(q,o, function(err, transactions) {
    if (err) throw err;
    self.respondWith(transactions, {type:'Transaction'});
   });
  };

  this.add = function (req, resp, params) {
   var self = this;
   this.buildData(function(data){
    data.params = params;
    self.respond(data);
   });
  };

  this.create = function (req, resp, params) {
   var self = this;
   var pfrom = {wareId:params.wareId, count:-params.count, placeId:params.fromLocation}
     , pto = {wareId:params.wareId, count:params.count, placeId:params.toLocation};
   var transactionFrom = geddy.model.Transaction.create(pfrom)
     , transactionTo = geddy.model.Transaction.create(pto);

   this.buildData(function(data){
    if (!transactionFrom.isValid() || !transactionTo.isValid()) self.respond(params);
    else {
     transactionFrom.save(function(err, data) {
      if (err) throw err;
      transactionTo.updateProperties({pairTransactionId:transactionFrom.id});
      transactionTo.save(function(err1, data1) {
       transactionFrom.updateProperties({pairTransactionId:transactionTo.id});
       transactionFrom.save(function(err3, data3) {
       if (err1||err3){
         geddy.model.Transaction.remove(transactionFrom.id, function(err2, data2){throw err1||err3||err2;});
         geddy.model.Transaction.remove(transactionTo.id, function(err2, data2){throw err1||err3||err2;});
        }
        self.respondWith(transactionTo, {status: err1});
       }
      });
     });
    }
   });
  };

  this.show = function (req, resp, params) {
    var self = this;
    console.dir(params);

    geddy.model.Transaction.first(params.id, function(err, transaction) {
      if (err) {
        throw err;
      }
      console.dir(transaction);
      if (!transaction) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(transaction);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Transaction.first(params.id, function(err, transactionA) {
     geddy.model.Transaction.first(transactionA.pairTransactionId, function(err, transactionB) {
      self.buildData(function(data){
       if (err) throw err;
       if (!transactionA||!transactionB) throw new geddy.errors.BadRequestError();
       else {
        data.transaction = {};
        data.transaction.fromLocation = transactionA.count<0?transactionA.placeId:transactionB.placeId;
        data.transaction.toLocation = transactionA.count>0?transactionA.placeId:transactionB.placeId;
        data.transaction.count = transactionA.count;
        data.transaction.wares = transactionA.wareId;
        self.respond(data);
       }
      });
     });
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Transaction.first(params.id, function(err, transaction) {
      if (err) {
        throw err;
      }
      transaction.updateProperties(params);

      if (!transaction.isValid()) {
        self.respondWith(transaction);
      }
      else {
        transaction.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(transaction, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Transaction.first(params.id, function(err, transaction) {
      if (err) {
        throw err;
      }
      if (!transaction) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Transaction.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(transaction);
        });
      }
    });
  };
};

exports.Transactions = Transactions;
