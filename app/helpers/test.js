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

var statchartid = 0;
var tableBody = function(fields, values, linkPath, linkField, actions){
 ret = "";
 actions = actions?actions:[];
 
 for(var v=0;v<values.length;++v){
  ret += "<tr>";
  for(var m=0;m<fields.length;++m){
//         <h3><%- linkTo(wares[i].name, warePath(wares[i].id)); %></h3>

   if(linkPath != undefined)
    ret += "<td>"+geddy.viewHelpers.linkTo(getSubProp(values[v],fields[m].field), linkPath(values[v][linkField]))+"</td>";
   else
    ret += "<td>"+getSubProp(values[v],fields[m].field)+"</td>";
  }
  for(var m=0;m<actions.length;++m){
    ret += "<td>"+geddy.viewHelpers.linkTo(actions[m].text,actions[m].path(values[v][linkField]))+"</td>";
  }
  ret += "</tr>";
  ret += "<tr><td colspan="+(actions.length+fields.length)+">";
  ret += "<div id=\"statchart"+statchartid+"\" class=\"epoch\">&nbsp;</div>"
  ret += "<script language=\"javascript\">";
  ret += "$('#statchart"+statchartid+"').epoch({type:'area', data:[{label:'Label 1', values:[{x:0,y:1},{x:1,y:3},{x:2,y:2}]}]"++"});";
  ret += "</script></td></tr>";
  statchartid++;
 }
 return ret;
}

module.exports.buildTable = function(fields, values, linkPath, linkField, actions, stats){
 var ret = "";

 ret += "<table class=\"dtables\"><thead><tr>";
 ret += tableHead(fields, actions);
 ret += "</tr></thead><tfoot><tr>";
 ret += tableHead(fields, actions);
 ret += "</tr></tfoot><tbody>";
 ret += tableBody(fields, values, linkPath, linkField, actions, stats);
 ret += "</tbody></table>\n";

 return ret;

}
