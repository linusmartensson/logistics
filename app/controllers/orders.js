var Orders = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

		q = {};
		o = {sort: {createdAt: 'asc'}};

    geddy.model.Order.all(q, o, function(err, orders) {
      if (err) {
        throw err;
      }
      self.respondWith(orders, {type:'Order'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.filteredList = function(req, resp, params) {
    var self = this;

		q = {};
		o = {sort: {createdAt: 'asc'}};
		    
		if(params.status != undefined) q.status = params.status;


    geddy.model.Order.all(q, o, function(err, orders) {
			if (err) {
				throw err;
			}
			self.respondWith(orders, {type:'Order'});
  	});
  }

  this.create = function (req, resp, params) {
    var self = this
      , order = geddy.model.Order.create(params);
		order.places = geddy.model.Places.all(function(err, places) {
			order.wares = geddy.model.Wares.all(function(err, wares) {
 	   		if (!order.isValid()) {
					order.wares = wares;
					order.places = places;
 	     		this.respondWith(order);
 	   		}
 	   		else {
 	     		order.save(function(err, data) {
						order.wares = wares;
						order.places = places;
 	       		if (err) {
 	         		throw err;
 	       		}
 	       		self.respondWith(order, {status: err});
 	     		});
	    	}
			});
		});
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
      if (err) {
        throw err;
      }
      if (!order) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(order);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
      if (err) {
        throw err;
      }
      if (!order) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(order);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
      if (err) {
        throw err;
      }
      order.updateProperties(params);

      if (!order.isValid()) {
        self.respondWith(order);
      }
      else {
        order.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(order, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
      if (err) {
        throw err;
      }
      if (!order) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Order.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(order);
        });
      }
    });
  };

};

exports.Orders = Orders;
