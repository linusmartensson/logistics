module.exports.Peq = function(b, c){
 if(c && this.url != b) return "";
 if((this.url).indexOf(b) == 0) return "class=\"active\"";
 return "";
};

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
var getSubProp = function(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    if(!obj) return "0";
    if(obj instanceof Date) obj = ""+pad(obj.getFullYear(),4) + "-" + pad(obj.getMonth()+1,2) + "-" + pad(obj.getDate(),2) + " " + pad(obj.getHours(),2) + ":" + pad(obj.getMinutes(),2) + ":" + pad(obj.getSeconds(),2);
    return obj;
}

var tableHead = function(fields, actions){
 ret = "";
 actions = actions?actions:[];

 for(var v=0;v<fields.length;++v){
  ret += "<th>"+fields[v].text+"</th>";
 }
 for(var v=0;v<actions.length;++v){
  ret += "<th>"+(actions[v].head?actions[v].head:"&nbsp;")+"</th>";
 }
 return ret;
}
var tableBody = function(fields, values, linkPath, linkField, actions){
 ret = "";
 actions = actions?actions:[];
 
 for(var v=0;v<values.length;++v){
  ret += "<tr>";
  for(var m=0;m<fields.length;++m){

   if(linkPath)
    ret += "<td>"+geddy.viewHelpers.linkTo(getSubProp(values[v],fields[m].field), linkPath(values[v][linkField]))+"</td>";
   else {
    if(fields[m].link){
     ret += "<td>"+geddy.viewHelpers.linkTo(getSubProp(values[v],fields[m].field), fields[m].link(values[v]))+"</td>";
    } else 
     ret += "<td>"+getSubProp(values[v],fields[m].field)+"</td>";
   }
  }
  for(var m=0;m<actions.length;++m){
    if(!actions[m].showif || actions[m].showif(values[v])) ret += "<td>"+geddy.viewHelpers.linkTo(actions[m].text,actions[m].path(values[v][linkField]))+"</td>";
    else ret += "<td>&nbsp</td>";
  }
  ret += "</tr>";
 }
 return ret;
}

module.exports.buildTable = function(fields, values, linkPath, linkField, actions){
 var ret = "";

 ret += "<table class=\"dtables\"><thead><tr>";
 ret += tableHead(fields, actions);
 ret += "</tr></thead><tfoot><tr>";
 ret += tableHead(fields, actions);
 ret += "</tr></tfoot><tbody>";
 ret += tableBody(fields, values, linkPath, linkField, actions);
 ret += "</tbody></table>\n";

 return ret;

}
