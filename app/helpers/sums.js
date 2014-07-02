

//Expects wares with association loading on transactions.
module.exports.computeWareSums = function(wares, next){
 geddy.model.Place.all(function(err, places) {
  if(err) throw err;
  var pk, wk, tk;

  var pmap = {};
  for(pk=0;pk<places.length;++pk){
   pmap[places[pk].id] = places[pk].group;
  }

  //Sum all transactions for each ware. Group by location type.
  for(var wk in wares){
   wares[wk].groupsums = {};
   wares[wk].placesums = {};
   var w = wares[wk];
   for(tk=0;tk<w.transactions.length;++tk){
    var t = w.transactions[tk];
    
    if(!wares[wk].placesums[t.placeId]) wares[wk].placesums[t.placeId] = 0;
    if(!wares[wk].groupsums[pmap[t.placeId]]) wares[wk].groupsums[pmap[t.placeId]] = 0;

    //Sum each ware for each individual location
    wares[wk].placesums[t.placeId] += t.count;
   
    //Sum each ware for each location group
    wares[wk].groupsums[pmap[t.placeId]] += t.count;
   }
  }
  next(wares);
 });
}
