module.exports.Peq = function(b, c){
 if(c && this.url != b) return "";
 if((this.url).indexOf(b) == 0) return "class=\"active\"";
 return "";
};
