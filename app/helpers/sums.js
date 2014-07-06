

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
  var sums = [];
  for(wk=0;wk<wares.length;++wk){
   sums[wk] = {};
   sums[wk].groupsums = {};
   sums[wk].placesums = {};
   var w = wares[wk];
   if(!w.transactions) continue;
   for(tk=0;tk<w.transactions.length;++tk){
    var t = w.transactions[tk];
    
    if(!sums[wk].placesums[t.placeId]) sums[wk].placesums[t.placeId] = 0;
    if(!sums[wk].groupsums[pmap[t.placeId]]) sums[wk].groupsums[pmap[t.placeId]] = 0;

    //Sum each ware for each individual location
    sums[wk].placesums[t.placeId] += t.count;
   
    //Sum each ware for each location group
    sums[wk].groupsums[pmap[t.placeId]] += t.count;
   }
  }
  next(wares, sums, places);
 });
}
