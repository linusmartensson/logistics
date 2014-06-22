var Transactions = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Transaction.all(function(err, transactions) {
      if (err) {
        throw err;
      }
      self.respondWith(transactions, {type:'Transaction'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , transaction = geddy.model.Transaction.create(params);

    if (!transaction.isValid()) {
      this.respondWith(transaction);
    }
    else {
      transaction.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(transaction, {status: err});
      });
    }
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
