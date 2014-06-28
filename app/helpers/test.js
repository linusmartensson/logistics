module.exports.Peq = function(b, c){
 if(c && this.url != b) return "";
 if((this.url).indexOf(b) == 0) return "class=\"active\"";
 return "";
};

var tableHead = function(fields){
 ret = "";

 for(var v=0;v<fields.length;++v){
  ret += "<th>"+fields[v].text+"</th>";
 }
 return ret;
}
var tableBody = function(fields, values, linkPath, linkField){
 ret = "";
 
 for(var v=0;v<values.length;++v){
  ret += "<tr>";
  for(var m=0;m<fields.length;++m){
//         <h3><%- linkTo(wares[i].name, warePath(wares[i].id)); %></h3>

   if(linkPath != undefined)
    ret += "<td>"+geddy.viewHelpers.linkTo(values[v][fields[m].field], linkPath(values[v][linkField]))+"</td>";
   else
    ret += "<td>"+values[v][fields[m].field]+"</td>";
  }
  ret += "</tr>";
 }
 return ret;
}


module.exports.buildTable = function(fields, values, linkPath, linkField){
 
 var ret = "<table class=\"dtable\"><thead><tr>";
 ret += tableHead(fields);
 ret += "</tr></thead><tfoot><tr>";
 ret += tableHead(fields);
 ret += "</tr></tfoot><tbody>";
 ret += tableBody(fields, values, linkPath, linkField);
 ret += "</tbody></table>\n";

 return ret;

}
