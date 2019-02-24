var rangeCheck = require('range_check');

var ip_address = function ip_address(addr) {
    var parts = addr.split('.').map(function(str) {
        return parseInt(str); 
    });
    
    return (parts[0] ? parts[0] << 24 : 0) +
    (parts[1] ? parts[1] << 16 : 0) +
    (parts[2] ? parts[2] << 8  : 0) +
    parts[3];
};

var checkIpaddrInRange = function checkIpaddrInRange(ipaddr, start, end) {
    var num = ip_address(ipaddr);
    return (num >= ip_address(start)) && (num <= ip_address(end));
}

var ipaddr='10.0.0.256'
var start='10.0.0.1'
var end='10.0.0.4'
var input_ip=rangeCheck.isIP(ipaddr); //returns true or false

if (input_ip==true) {
    var result= checkIpaddrInRange(ipaddr,start,end)
    console.log(result);
} else {
    console.log("Invalid IPaddress ");
    
}
