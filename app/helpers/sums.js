

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
   sums[wk].avguse = {};
   sums[wk].stddev = {};
   var w = wares[wk];
   if(!w.transactions) continue;
   for(tk=0;tk<w.transactions.length;++tk){
    var t = w.transactions[tk];
    
    if(!sums[wk].placesums[t.placeId]) sums[wk].placesums[t.placeId] = 0;
    if(!sums[wk].stddev[t.placeId]) sums[wk].stddev[t.placeId] = 0;
    if(!sums[wk].groupsums[pmap[t.placeId]]) sums[wk].groupsums[pmap[t.placeId]] = 0;

    //Sum each ware for each individual location
    sums[wk].placesums[t.placeId] += t.count;
   
    //Sum each ware for each location group
    sums[wk].groupsums[pmap[t.placeId]] += t.count;

    if(tk+1<w.transactions.length){
     var m = w.transactions[tk+1];
     sums[wk].stddev[t.placeId] += (m.count+t.count)*(m.count+t.count)/(new Date(m.createdAt).UTC()-new Date(t.createdAt).UTC());
    }
   }
   for(var v in sums[wk].placesums){
    sums[wk].avguse[v] = (sums[wk].placesums[v])/(new Date(w.transactions[w.transactions.length-1].createdAt).UTC() - new Date(w.transactions[0].createdAt).UTC());
    sums[wk].stddev[v] = Math.sqrt(sums[wk].stddev[v]/(new Date(w.transactions[w.transactions.length-1].createdAt).UTC() - new Date(w.transactions[0].createdAt).UTC()));
   }
  }
  next(wares, sums, places);
 });
}
