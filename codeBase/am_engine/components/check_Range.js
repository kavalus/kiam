// var Time = function (timeString) {
//     var t = timeString.split(":");
//     this.hour = parseInt(t[0]);
//     this.minutes = parseInt(t[1]);
//     this.isBiggerThan = function (other) {
//         return (this.hour > other.hour) || (this.hour === other.hour) && (this.minutes > other.minutes);
//     };
// }

// var timeIsBetween = function (start, end, check) {
//     return (start.hour <= end.hour) ? check.isBiggerThan(start) && !check.isBiggerThan(end)
//         : (check.isBiggerThan(start) && check.isBiggerThan(end)) || (!check.isBiggerThan(start) && !check.isBiggerThan(end));

// }
// console.log(timeIsBetween, "yyyyyyyyyyyyyyy")

// var openTime = new Time("23:30");
// var closeTime = new Time("06:30");
// var checkTime = new Time("02:30");

// var isBetween = timeIsBetween(openTime, closeTime, checkTime);
// console.log(isBetween, "44444444")

var atoi = function atoi(addr) {
    var parts = addr.split('.').map(function (str) {
        return parseInt(str);
    });

    return (parts[0] ? parts[0] << 24 : 0) +
        (parts[1] ? parts[1] << 16 : 0) +
        (parts[2] ? parts[2] << 8 : 0) +
        parts[3];
};

var checkIpaddrInRange = function checkIpaddrInRange(ipaddr, start, end) {
    var num = atoi(ipaddr);
    return (num >= atoi(start)) && (num <= atoi(end));
}






function timeToNumber(timeString) {
    var t = timeString.split(" ");

    var offset = 0;
    // if (t[1] == "PM") {
    //   offset = 12;
    // }
    var hm = t[0].split(":");

    var hours = Number(hm[0]) + offset;

    return hours * 100 + Number(hm[1]);
}

function timeCompare(min, max, ref) {
    console.log(min, max, ref+"ssssssssssssssssssssssssssssssssssssssssss")
    console.log((timeToNumber(min) <= timeToNumber(ref)) && (timeToNumber(ref) <= timeToNumber(max)))
    return (timeToNumber(min) <= timeToNumber(ref)) && (timeToNumber(ref) <= timeToNumber(max));
}

// var rangeMin = "06:00";
// var rangeMax = "24:00";
// var reference = "07:00"



//   console.log(timeCompare(rangeMin, rangeMax, current_time),"TIME TIME TIME")

// checkIpaddrInRange('10.0.1.1', '10.0.0.1', '10.0.2.1'); // => true

// checkIpaddrInRange('10.0.3.1', '10.0.0.1', '10.0.2.1'); // => false
// console.log(checkIpaddrInRange('10.0.3.1', '10.0.0.1', '10.0.2.1'))



// module.exports = {
//     timeIsBetween: function () { },
//     checkIpaddrInRange: function () { }
// }
exports.check_IP = checkIpaddrInRange;
// module.exports={


// }
exports.check_TIME = timeCompare;
// exports.put_time = Time;