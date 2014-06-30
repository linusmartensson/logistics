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
      if (err) {
        throw err;
      }
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

    var pfrom = params
      , pto = params;

    pfrom.placeId = params.fromLocation;
    delete pfrom.fromLocation;
    delete pfrom.toLocation;
    pto.placeId = params.toLocation;
    delete pto.fromLocation;
    delete pto.toLocation;
    
    pfrom.count = -pfrom.count;

    var transactionFrom = geddy.model.Transaction.create(pfrom)
      , transactionTo = geddy.model.Transaction.create(pto);

    this.buildData(function(data){
      if (!transactionFrom.isValid() || !transactionTo.isValid()) {
         
        self.respond(params);
      }
      else {
        transactionFrom.save(function(err, data) {
          if (err) {
            throw err;
          }
          transactionTo.save(function(err1, data1) {
            if (err1) {
              geddy.model.Transaction.remove(transactionFrom.id, function(err2, data2){
                throw err1;
              });
            }
            self.respondWith(transactionTo, {status: err1});
          });
        });
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Transaction.first(params.id, function(err, transaction) {
      if (err) {
        throw err;
      }
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

    geddy.model.Transaction.first(params.id, function(err, transaction) {
      if (err) {
        throw err;
      }
      if (!transaction) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(transaction);
      }
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
