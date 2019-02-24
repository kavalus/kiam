
var Time = function (timeString) {
    var t = timeString.split(":");
    this.hour = parseInt(t[0]);
    this.minutes = parseInt(t[1]);
    this.isBiggerThan = function (other) {
        return (this.hour > other.hour) || (this.hour === other.hour) && (this.minutes > other.minutes);
    };
}

var timeIsBetween = function (start, end, check) {
    return (start.hour <= end.hour) ? check.isBiggerThan(start) && !check.isBiggerThan(end)
        : (check.isBiggerThan(start) && check.isBiggerThan(end)) || (!check.isBiggerThan(start) && !check.isBiggerThan(end));

}

var openTime = new Time("02:30");
var closeTime = new Time("03:00");
var checkTime = new Time("02:29");

var isBetween = timeIsBetween(openTime, closeTime, checkTime);
console.log(isBetween)



