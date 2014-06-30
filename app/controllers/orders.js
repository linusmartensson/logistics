var Orders = function () {
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

		q = {status: {ne:'complete'}};
		o = {sort: {createdAt: 'asc'}, includes: ['places', 'wares']};

    geddy.model.Order.all(q, o, function(err, orders) {
      if (err) {
        throw err;
      }
      self.respondWith(orders, {type:'Order'});
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

  this.add = function (req, resp, params) {
		var self = this; 
		this.buildData(function(data){
		  data.params = params;
			self.respond(data);
		});
  };

  this.create = function (req, resp, params) {
    params.status = "open";
    var self = this
      , order = geddy.model.Order.create(params);
          
	  this.buildData(function(data){	
				data.params = params;
 	   		if (!order.isValid()) {
 	     		this.respond(data);
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


  this.manage = function (req, resp, params) {
   var self = this;

   geddy.model.Order.first(params.id, {includes:['places']}, function(err, order) {
    if(err) throw err;
    self.buildData(function(data){
     data.order = order;
     self.respond(data);
    });
   });
  };
  this.complete = function( req, resp, params) {
   var self = this;
   geddy.model.Order.first(params.id, function(err, order) {



     var pfrom = {wareId:order.wareId, count:-params.count, placeId:params.fromLocation}
       , pto = {wareId:order.wareId, count:params.count, placeId:params.toLocation};
     if(order.group == 'external') { //NOT correct atm.
       pfrom.placeId = order.placeId;
       pto.placeId = params.targetLocation;
     } else {
       pfrom.placeId = params.targetLocation;
       pto.placeId = order.placeId;
     }

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
   });
  }


  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
		  var ooo = order;
			self.buildData(function(data){
		    data.order = ooo;
      	if (err) {
        	throw err;
      	}
      	if (!ooo) {
        	throw new geddy.errors.BadRequestError();
      	}
      	else {
        	self.respond(data);
      	}
			});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Order.first(params.id, function(err, order) {
			self.buildData(function(data){
      	if (err) {
        	throw err;
      	}
      	order.updateProperties(params);
			  data.order = order;

      	if (!order.isValid()) {
        	self.respond(data);
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
