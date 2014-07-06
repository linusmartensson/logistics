module.exports.Peq = function(b, c){
 if(c && this.url != b) return "";
 if((this.url).indexOf(b) == 0) return "class=\"active\"";
 return "";
};

var getSubProp = function(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    if(!obj) return "0";
    if(obj instanceof Date) obj = ""+obj.getFullYear() + "-" + obj.getMonth() + "-" + obj.getDate() + " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
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
