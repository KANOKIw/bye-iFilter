"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var PORT = 80;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var jquery = require("jquery");
var crypto = require("crypto");
const cheerio = require('cheerio');


var Random = /** @class */ (function () {
    function Random() {
    }
    /**
     * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
     * @param {number} origin the least value that can be returned
     * @param {number} bound the upper bound (inclusive) for the returned value
     *
     * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
     * @throws IllegalArgumentException - if origin is greater than or equal to bound
     */
    Random.prototype.nextInt = function (origin, bound) {
        if (origin === undefined && bound === undefined) {
            var num = Math.random();
            return num > 0.5 ? 1 : 0;
        }
        return Math.floor(Math.random() * (bound - origin + 1)) + origin;
    };
    Random.prototype.string = function (length) {
        var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (!length)
            length = 16;
        return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((n)=>S[n%S.length]).join('');
    };
    /**
     * Random choices from given Array
     * @param {Array<any>} list
     * @returns any
     */
    Random.prototype.randomChoice = function (list) {
        return list[this.nextInt(0, list.length - 1)];
    };
    return Random;
}());

var random = new Random();

function time() {
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
    return "[".concat(year, "-").concat(month, "-").concat(date, " ").concat(hour, ":").concat(minute, ":").concat(second, "]");
}


function _time()
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


function getJSON(path, encoding){
    if (!encoding){
        encoding = "utf-8";
    }
    return JSON.parse(fs.readFileSync(path, encoding));
}


function writeLog(msg){
    var p = "";
    try{
        p = fs.readFileSync("./Latest.log");
    } catch (e){}
    p += msg;
    fs.writeFileSync("./Latest.log", p);
}


function getParam(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function toAbsPath(url, html){
    var _url = new URL(url);
    var domain = _url.origin;
    // startsWith("/[^/]");
    html = html.replaceAll(/(src|href|content)="\/([^\/].*?)"/g, '$1="' + domain + '/$2"');
    html = html.replaceAll(/url\("\/([^\/].+)"\)/g, 'url("' + domain + '/$1")');
    // startsWith("./");
    html = html.replaceAll(/(src|href|content)="\.\/(.*?)"/g, '$1="' + url.substring(0, url.lastIndexOf("/")) + '/$2"');
    html = html.replaceAll(/url\("\.\/(.+)"\)/g, 'url("' + url.substring(0, url.lastIndexOf("/")) + '/$1")');
    // startsWith("//");
    html = html.replaceAll(/(src|href|content)="\/\/(.*?)"/g, '$1="' + _url.protocol + '//$2"');
    html = html.replaceAll(/url\("\/\/(.+)"\)/g, 'url("' +  _url.protocol + '//$1")');
    return html;
}


function addInterval(html, url){
    html += `\n<script id="__THIRD_PARTY_kanokiw.com__">\n`;
    //html += `const __ORIGIN_URL__ = "${url}";`;
    html += fs.readFileSync("./src/js/__THIRD_PARTY_kanokiw.com__.js");
    html += "\n</script>";
    return html;
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./"));

var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
/*
// cors
cors:{
    origin: ["http://xxxx"]
}
*/
});

io.on("connection", function (socket) {
    socket.on("disconnect", function(event){

    });
});

app.post("/loc", function (req, res) {
    var body = req.body;
    fs.writeFileSync("./.location/location.json", JSON.stringify(body, null, 4));
    res.end();
});

app.post("/fetch-for-ipad", async function(req, res){
    var body = req.body;
    var url = body.url;
    var co_path = "./.tie_preview_iframes/.co.json";
    var original_url = url;
    var t = 0;

    for (var p of ["http", "https"]){
        for (var l of ["co.jp", "com"]){
            if (
                url != null && 
                (
                    url.startsWith(p+"://www.google."+l+"/url")
                    || url.startsWith(p+"://google."+l+"/url")
                )
            ){
                var base = url;
                url = getParam("url", base);
                if (url == null)
                    url = getParam("q", base);
                url = decodeURIComponent(url);
                t = !0;
                break;
            }
        }
        if (t) break;
    }
    try {
        var response = await fetch(url, {method: "GET", mode: "cors", cache: "no-cache"});
        var rn = random.string(16);
        var all = getJSON(co_path);
        var text = await response.text();
        var path = "./.tie_preview_iframes/"+rn+".html";
        var client_path = path.slice(1);
        
        console.log(`${time()} GET: ${url} --s=${rn}`);
        writeLog(`INFO: ${time()} GET: ${url} --s=${rn}\n`);
        url = response.url;
        text = toAbsPath(url, text);
        text = addInterval(text, url);

        var $ = jquery((new JSDOM(text).window));
        var ch = cheerio.load(text);
        var title = $("title").text();
        var favicon_url = ch('link[rel="icon"]').attr("href") || ch('link[rel="shortcut icon"]').attr("href");

        if (favicon_url == undefined)
            favicon_url = null;
        if ((new URL(url)).hostname.includes("google") && favicon_url == null)
            favicon_url = "https://cdn.icon-icons.com/icons2/2642/PNG/512/google_logo_g_logo_icon_159348.png";
        await fs.writeFileSync(path, text);

        var t = _time();
        if (!title) title = null;
        all[rn] = {path: client_path, url: original_url.replaceAll(" ", ""), title: title, favicon_url: favicon_url, timestamp: t};
        fs.writeFileSync(co_path, JSON.stringify(all, null, 2), "utf-8");
        res.status(200).send({original: text, iframe: client_path, fy: rn, path: client_path,
            url: original_url.replaceAll(" ", ""), title: title, favicon_url: favicon_url, timestamp: t});
    } catch (error){
        writeLog("ERROR: "+time() + " " + error.stack + JSON.stringify(error, null, 2) + "\n");
        console.log(time(), error);
        res.status(500).send("Error: " + error.message);
    }
});

app.post("/iframe-data", (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    try{
        var id = req.body.id;
        var d = getJSON(co_path);
        var data = d[id];
        res.status(200).send(
            {title: data.title, url: data.url,
                favicon_url: data.favicon_url, timestamp: data.timestamp}
        );
    } catch (e){
        res.status(500).end()
    }
});

app.get("/view", (req, res) => {
    res.sendFile(__dirname + "/src//view/index.html");
});

app.get("/find/:stringid", (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    var stringid = req.params.stringid;
    var data = getJSON(co_path)[stringid];

    if (data){
        var re = data.path;
        res.sendFile(__dirname + re);
    } else {
        res.status(404).sendFile(__dirname + "/src/lost/index.html");
    }
});

app.get("/raw/:stringid", (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    var stringid = req.params.stringid;
    var data = getJSON(co_path)[stringid];

    console.log(`${time()} Raw: ${req.url} --s=${stringid}`);
    try{
        var re = data.path;
        fs.writeFileSync("./.tie_preview_iframes/rawTXT/"+stringid+".txt", fs.readFileSync("."+re))
        writeLog(`INFO: ${time()} Raw: ${req.url} --s=${stringid}\n`);
        res.sendFile(__dirname + "/.tie_preview_iframes/rawTXT/"+stringid+".txt");
    } catch (e){
        writeLog(`WARN: ${time()} Raw: ${req.url} --s=${stringid}\n    404: NOT FOUND\n`);
        console.log("    404: NOT FOUND");
        res.status(404).sendFile(__dirname + "/src/lost/index.html");
    }
});

app.get("/iframe/:stringid", (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    var stringid = req.params.stringid; 
    var data = getJSON(co_path)[stringid];

    if (data){
        var re = data.path;
        var url = data.url
        res.send({path: re, url: url, title: data.title});
    } else {
        res.status(500).sendFile(__dirname + "/src/lost/index.html");
    }
});

app.get("/browse", async function(req, res){
    var url = req.query.u;
    var wi = req.query.w;
    if (url == null){
        res.status(404).sendFile(__dirname + "/src/lost/index.html");
        return;
    }
    var co_path = "./.tie_preview_iframes/.co.json";
    url = decodeURIComponent(url);
    var original_url = url;
    try {
        var response = await fetch(url, {method: "GET", mode: "cors", cache: "no-cache"});
        var rn = random.string(16);
        var all = getJSON(co_path);
        var text = await response.text();
        var path = "./.tie_preview_iframes/"+rn+".html";
        var client_path = path.slice(1);
        
        console.log(`${time()} GET: ${url} --s=${rn}`);
        url = response.url;
        text = toAbsPath(url, text);
        text = addInterval(text, url);

        var $ = jquery((new JSDOM(text).window));
        var ch = cheerio.load(text);
        var title = $("title").text();
        var favicon_url = ch('link[rel="icon"]').attr("href") || ch('link[rel="shortcut icon"]').attr("href");

        if (favicon_url == undefined)
            favicon_url = null;
        if ((new URL(url)).hostname.includes("google") && favicon_url == null)
            favicon_url = "https://cdn.icon-icons.com/icons2/2642/PNG/512/google_logo_g_logo_icon_159348.png";
        await fs.writeFileSync(path, text);

        var t = _time();
        all[rn] = {path: client_path, url: original_url.replaceAll(" ", ""), title: title, favicon_url: favicon_url, timestamp: t};
        fs.writeFileSync(co_path, JSON.stringify(all, null, 2), "utf-8");
        var uk = "http://kanokiw.com/view?s="+rn+"&fb=redirect";
        if (wi == "fullscreen")
            uk = "http://kanokiw.com/find/"+rn+"?fb=redirect";
        res.status(200).redirect(uk);
    } catch (error){
        writeLog(time() + " " + error.stack + JSON.stringify(error, null, 2) + "\n");
        console.log(time(), error);
        res.status(500).redirect("http://kanokiw.com/?wrong=wrong&u="+encodeURIComponent(url));
    }
});

server.listen(PORT, function () {
    console.log("".concat(time(), " Running Express Server at mode:").concat(PORT));
});

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/src/lost/index.html");
});
