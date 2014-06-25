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


	this.buildData = function(next){
		geddy.model.Place.all(function(err, places) {
			geddy.model.Ware.all(function(err, wares) {
			  for(var w in wares){
					wares[w].text = wares[w].name + ", " + wares[w].orderno + ", " + wares[w].price + ", " + wares[w].packaging + ", " + wares[w].storage;
					wares[w].value = wares[w]._id;
				}
			  for(var p in places){
					places[p].text = places[p].name + ", " + places[p].location;
					places[p].value = places[p]._id;
				}
  			next({wares:wares, places:places});
			});
		});

	}

  this.add = function (req, resp, params) {
		var self = this; 
		this.buildData(function(data){
		  data.params = params;
			self.respond(data);
		});
  };

  this.create = function (req, resp, params) {
    var self = this
      , order = geddy.model.Order.create(params);
	  this.buildData(function(data){	
				data.order = order;
 	   		if (!order.isValid()) {
 	     		this.respondWith(data);
 	   		}
 	   		else {
 	     		order.save(function(err, data) {
 	       		if (err) {
 	         		throw err;
 	       		}
 	       		self.respondWith(data, {status: err});
 	     		});
	    	}
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
