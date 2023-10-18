"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var fs = require("fs");
var bodyParser = require('body-parser');
var app = express();
var PORT = 80;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var jquery = require('jquery');
var crypto = require("crypto");


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


function getJSON(path){
    return JSON.parse(fs.readFileSync(path));
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./'));

var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
/*
// cors設定はこれ
cors:{
    origin: ["http://xxxx"]
}
*/
});

io.on("connection", function (socket) {
    socket.on("disconnect", function(e){
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
    try {
        var response = await fetch(url);
        var rn = random.string(8);
        var all = getJSON(co_path);
        var text = await response.text();
        var path = "./.tie_preview_iframes/"+rn+".html";
        var client_path = path.slice(1);
        await fs.writeFileSync(path, text);

        all[rn] = {path: client_path, url: url.replaceAll(" ", "")};
        fs.writeFileSync(co_path, JSON.stringify(all, null, 2), "utf-8");
        res.send({original: text, iframe: client_path, fy: rn});
    } catch (error){
        console.log(error)
        res.status(500).send("Error: " + error.message);
    }
});

app.get('/find/:stringid', (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    var stringid = req.params.stringid; 
    var data = getJSON(co_path)[stringid];

    if (data){
        var re = data.path;
        res.sendFile(__dirname + re);
    } else {
        res.redirect("/src/lost/");
    }
});

app.get('/iframe/:stringid', (req, res) => {
    var co_path = "./.tie_preview_iframes/.co.json";
    var stringid = req.params.stringid; 
    var data = getJSON(co_path)[stringid];

    if (data){
        var re = data.path;
        var url = data.url
        res.send({path: re, url: url});
    } else {
        res.status(500).send("Error: undefined");
    }
});

server.listen(PORT, function () {
    console.log("".concat(time(), " Running Express Server at mode:").concat(PORT));
});

app.use((req, res, next) => {
    res.status(404).redirect("/src/lost/");
});
