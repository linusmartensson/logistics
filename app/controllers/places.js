var Places = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Place.all(function(err, places) {
      if (err) {
        throw err;
      }
      self.respondWith(places, {type:'Place'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , place = geddy.model.Place.create(params);

    if (!place.isValid()) {
      this.respondWith(place);
    }
    else {
      place.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(place, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Place.first(params.id, function(err, place) {
      if (err) {
        throw err;
      }
      if (!place) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respond({place:[place]});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Place.first(params.id, function(err, place) {
      if (err) {
        throw err;
      }
      if (!place) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(place);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Place.first(params.id, function(err, place) {
      if (err) {
        throw err;
      }
      place.updateProperties(params);

      if (!place.isValid()) {
        self.respondWith(place);
      }
      else {
        place.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(place, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Place.first(params.id, function(err, place) {
      if (err) {
        throw err;
      }
      if (!place) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Place.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(place);
        });
      }
    });
  };

};

exports.Places = Places;
