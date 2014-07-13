exports.requireGroup = function (group) {
 return function(){
  var sgroup = this.session.get('userGroup');
  if(!sgroup || (group instanceof String && sgroup != group)) this.redirect('/');
  else {
   for(var v=0;v<group.length;++v){
    if(sgroup == group[v]) return; 
   }
   this.redirect('/');
  }
 }
}

exports.checkGroup = function (group) {
 return function(){
  var sgroup = this.session.get('userGroup');
  if(!sgroup || (group instanceof String && sgroup != group)) return false;
  else {
   for(var v=0;v<group.length;++v){
    if(sgroup == group[v]) return true; 
   }
   return false;
  }
  return true;
 }
}

