

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
   sums[wk].derivs = {};
   sums[wk].estimate = {};
   var w = wares[wk];
   if(!w.transactions) continue;
   
   var m = w.transactions[0];
   for(tk=0;tk<w.transactions.length;++tk){
    var t = w.transactions[tk];
    var ts = w.transactions[tk-1];
    
    if(!sums[wk].derivs[t.placeId]) sums[wk].derivs[t.placeId] = [];
    if(!sums[wk].placesums[t.placeId]) sums[wk].placesums[t.placeId] = 0;
    if(!sums[wk].groupsums[pmap[t.placeId]]) sums[wk].groupsums[pmap[t.placeId]] = 0;

    //Sum each ware for each individual location
    sums[wk].placesums[t.placeId] += t.count;
   
    //Sum each ware for each location group
    sums[wk].groupsums[pmap[t.placeId]] += t.count;

    if(tk>1){
  
     //Warning! This is based on shops being closed an average of 10 hours, and WILL err heavily if the times cross a month boundary!
     sums[wk].derivs[t.placeId].push(sums[wk].placesums[t.placeId]/(ts.createdAt.getTime()-m.createdAt.getTime() - (ts.createdAt.getDate()-m.createdAt.getDate())*(1000*60*60*10)));
    }
   }

   for(var v=0;v<places.length;++v){
    var t = places[v].id;
    sums[wk].derivs[t].sort(function(a,b){return a-b});
   
    //Median derivative
    sums[wk].avguse[t] = sums[wk].derivs[t][sums[wk].derivs[t].length/2];
   
    //Total amount of wares in the location minus computed derivative multiplied by time since first transaction into location.
    sums[wk].estimate[t] = sums[wk].placesums[t] - sums[wk].avguse[t]*(new Date().getTime()-m.createdAt.getTime()-(new Date().getDate()-m.createdAt.getDate())*(1000*60*60*10));
   }
  }
  next(wares, sums, places);
 });
}
