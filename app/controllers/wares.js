var Wares = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.all({}, {includes:['transactions']},function(err, wares) {
      if (err) {
        throw err;
      }
      geddy.viewHelpers.computeWareSums(wares, function(res){
       self.respond({wares:res});
      });
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , ware = geddy.model.Ware.create(params);

    if (!ware.isValid()) {
      this.respondWith(ware);
    }
    else {
      ware.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(ware, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.first(params.id, function(err, ware) {
      if (err) {
        throw err;
      }
      if (!ware) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(ware);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.first(params.id, function(err, ware) {
      if (err) {
        throw err;
      }
      if (!ware) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(ware);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.first(params.id, function(err, ware) {
      if (err) {
        throw err;
      }
      ware.updateProperties(params);

      if (!ware.isValid()) {
        self.respondWith(ware);
      }
      else {
        ware.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(ware, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.first(params.id, function(err, ware) {
      if (err) {
        throw err;
      }
      if (!ware) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Ware.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(ware);
        });
      }
    });
  };

};

exports.Wares = Wares;
