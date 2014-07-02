

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
  for(wk=0;wk<wares.length;++wk){
   var w = wares[wk];
   console.dir(w);
   w.groupsums = {};
   w.placesums = {};
   for(tk=0;tk<transactions.length;++tk){
    var t = w.transactions[tk];
    
    if(!w.placesums[t.placeId]) w.placesums[t.placeId] = 0;
    if(!w.groupsums[pmap[t.placeId]]) w.groupsums[pmap[t.placeId]] = 0;

    //Sum each ware for each individual location
    w.placesums[t.placeId] += t.count;
   
    //Sum each ware for each location group
    w.groupsums[pmap[t.placeId]] += t.count;
   }
   delete w.transactions;
  }
 });
 next(wares);

}
