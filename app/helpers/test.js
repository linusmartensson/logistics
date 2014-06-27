module.exports.Test = function(m){
	var s = [];
	return JSON.stringify(m, function(k,v){
		if(v != null && typeof v == "object"){
			if(s.indexOf(v) >= 0) return;
			s.push(v);
  		}
		return v;
 	});
};
