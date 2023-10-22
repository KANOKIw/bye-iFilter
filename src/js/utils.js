function time()
{
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth();
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    if (month < 10)
        month = "0".concat(month);
    if (date < 10)
        date = "0".concat(date);
    if (hour < 10)
        hour = "0".concat(hour);
    if (minute < 10)
        minute = "0".concat(minute);
    if (second < 10)
        second = "0".concat(second);
    return [year, "/", month, "/", date, " ", hour, ":", minute, ":", second].join("");
}

function getBrowserName()
{
    var userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
        return "chrome";
    } else if (userAgent.includes("Firefox")) {
        return "firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "safari";
    } else if (userAgent.includes("Edge")) {
        return "edge";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
        return "internet_explorer";
    } else {
        return "unknown";
    }
}
