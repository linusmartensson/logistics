
var passport = require('../helpers/passport')
  , generateHash = passport.generateHash
  , requireAuth = passport.requireAuth
  , requireGroup = passport.requireGroup;

var Orders = function () {
  
this.before(function(){requireGroup(['runner', 'seller', 'controller']);}, {
    only: ['index', 'show', 'add', 'create', 'update', 'edit']
  });
  this.before(function(){requireGroup(['controller']);}, {
    only: ['remove']
  });

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

		q = {and:[{status: {ne:'complete'}}, {status: {ne:'complete-extra'}}]};
		o = {sort: {createdAt: 'asc'}, includes: ['places', 'wares']};

    geddy.model.Order.all(q, o, function(err, orders) {
      if (err) {
        throw err;
      }
      self.respondWith(orders, {type:'Order'});
    });
  };

  this.full = function (req, resp, params) {
    var self = this;

		q = {};
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

    geddy.model.Order.first(params.id, {includes:['places','wares']}, function(err, order) {
      if (err) {
        throw err;
      }
      if (!order) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respond({order:[order]});
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


     var pfrom = {wareId:order.wareId, count:-params.count}
       , pto = {wareId:order.wareId, count:params.count};


     //setup order direction based on order type.
     if(order.group == 'pickup') {
       pfrom.placeId = order.placeId;
       pto.placeId = params.targetLocation;
     } else {
       pfrom.placeId = params.targetLocation;
       pto.placeId = order.placeId;
     }

     //create transactions
     var transactionFrom = geddy.model.Transaction.create(pfrom)
       , transactionTo = geddy.model.Transaction.create(pto);


     //finish order
     if( params.count >= order.count)
      order.updateProperties({status:"complete"});
      
      //We may have sent more than necessary.
      if(params.count > order.count){
       //if so, create an extra completed order to reflect that.
       var completeOrder = geddy.model.Order.create({wareId:order.wareId, count:params.count-order.count, status:"complete-extra", group:order.group, placeId:order.placeId});
       completeOrder.save(function(err,data){});
      }
     else {
      //We couldn't fulfill the whole order, so reopen it and update the remaining order count.
      order.updateProperties({status:"open", count:(order.count-params.count)});

      //Async-save the completed order
      var completeOrder = geddy.model.Order.create({wareId:order.wareId, count:params.count, status:"complete", group:order.group, placeId:order.placeId});
      completeOrder.save(function(err,data){});
     }

     //etc
     self.buildData(function(data){
       if (!transactionFrom.isValid() || !transactionTo.isValid() || !order.isValid()) {
          
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
             order.save(function(err2, data2) {
              if (err2) {
               geddy.model.Transaction.remove(transactionFrom.id, function(err3, data3){
                 geddy.model.Transaction.remove(transactionTo.id, function(err4, data4){
                   throw err2;
                 });
               });
                
              }
              self.redirect("/orders");
             });
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
