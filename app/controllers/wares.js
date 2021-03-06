

var Wares = function () {
var requireGroup = geddy.viewHelpers.requireGroup;
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireGroup(['runner', 'seller', 'controller']), {
    only: ['index', 'show']
  });
  this.before(requireGroup(['controller']), {
    only: ['remove', 'add', 'create', 'update', 'edit']
  });

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Ware.all({}, {sort:{'transactions.createdAt':'asc'}, includes:['transactions']},function(err, wares) {
      if (err) {
        throw err;
      }
      geddy.viewHelpers.computeWareSums(wares, function(res, sums, places){
       self.respond({wares:res, sums:sums});
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

    geddy.model.Ware.all({'id':params.id}, {sort:{'transactions.createdAt':'asc'}, includes:['transactions']}, function(err, ware) {
      if (err) {
        throw err;
      }
      if (!ware) {
        throw new geddy.errors.NotFoundError();
      }
      else {
       geddy.viewHelpers.computeWareSums(ware, function(res, sums, places){
         self.respond({ware:res, sums:sums, places:places});
       });
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
