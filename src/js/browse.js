var typing = document.getElementById("typing");
var _hr = document.getElementById("cent-a_");
var submitter = document.getElementById("cent-submit");
var submitter_gg = document.getElementById("cent-gg");
var cent_for = document.getElementById("cent-for");
var _history = document.getElementById("cent-hist");
var _history_bc = document.getElementById("hist_viewer_back");
var typing_clearer = document.getElementById("typing_clearer");
var wrong = getParam("wrong");
var fb = getParam("fb");
var notifier_count = 0;
var HIST_OPENED = false;
var GOOLE = `<!--
    --><span style="color: #4285F4;">G</span><!--
    --><span style="color: #DB4437;">o</span><!--
    --><span style="color: #F4B400;">o</span><!--
    --><span style="color: #4285F4;">g</span><!--
    --><span style="color: #0F9D58;">l</span><!--
    --><span style="color: #DB4437;">e</span><!--
-->`;

if (wrong){
    var u = decodeURI(getParam("u"));
    showSmthWentWrong(u);
    throw new Error();
}

!function(){
    if (window.location.href.includes("?"))
        window.location.href = "/";
}();

function getParam(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * only do show(main);
*/
!function(){
    var s = getParam("s");

    if (s !== null){
        $.ajax({
            url: "/iframe/"+s,
            type: "GET",
            timeout: 10_000,
        })
        .done(d)
        .fail(f);
        function d(data){
            var path = data.path;
            var u = data.url;
            var title = data.title;
            var a = "";

            if (title){
                $("title").text(`${title} | Browser | KANOKIw`);
            }
            if (u.startsWith("http://")){
                var ex = "https"+u.slice(4);
                a = `<a href="${u}">${u}</a><span style="color: var(--color-primary);;">&nbsp;|&nbsp;</span><a href="${ex}">${ex}</a>`
            } else {
                a = `<a href="${u}">${u}</a>`;
            }
            write_iFrame(path, s);
            $("#typing").html(a).attr("contenteditable", "false");
        }
        function f(error){
            document.getElementsByTagName("html")[0].innerHTML = error.responseText;
            throw new Error();
        }
    }
    $("#aw").show();
}();

!function(t, s, c, j, h, i, z)
{
    t.addEventListener("input", function(event){
        var q = this.textContent;
    });
    s.addEventListener("click", function(event){
        var url = t.textContent;

        if (url.length < 1){
            doAnimation("#typing_wrapper", "border_warn");
            return;
        }
        var syms = ["\n", " ", "　"];
        for (var s of syms){
            url = url.replaceAll(s, "");
        }
        if (
            url.startsWith("https://www.google.co.jp/url")
            || url.startsWith("https://www.google.com/url")
            || url.startsWith("https://google.co.jp/url")
            || url.startsWith("https://google.com/url")
            || url.startsWith("http://www.google.co.jp/url")
            || url.startsWith("http://www.google.com/url")
            || url.startsWith("http://google.co.jp/url")
            || url.startsWith("http://google.com/url")
            ){  // i-filter base url
            var base = url;
            url = getParam("url", base);
            if (url == null)
                url = getParam("q", base);
            url = decodeURIComponent(url);
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))){
            url = "http://"+url; // auto redirects to https
        }
        if (url.startsWith("http://www.kanokiw.com")
            || url.startsWith("http://kanokiw.com")
            || url.startsWith("http://preview.kanokiw.com")
            || url.startsWith("www.kanokiw.com")
            || url.startsWith("kanokiw.com")
            || url.startsWith("preview.kanokiw.com")
            ){
            goToSmthWentWrong();
        }
        if ((new URL(url)).origin == url)
            url += "/";
        $("#getterBtn").show();
        getHTML(url);
    });
    c.addEventListener("click", function(event){
        var q = t.textContent;
        if (q.length < 1){
            doAnimation("#typing_wrapper", "border_warn");
            return;
        }
        q = q.replace(" ", "+");
        q = encodeURIComponent(q);
        var url = `https://www.google.co.jp/search?q=${q}&oq=${q}+&sourceid=${getBrowserName()}&client=${getBrowserName()}&ie=UTF-8&oe=UTF-8`;
        if ((new URL(url)).origin == url)
            url += "/";
        $("#googlerBtn").show();
        getHTML(url);
    });
    j.addEventListener("click", function(){
        t.focus();
        doAnimation("#typing_wrapper", "border_notice");
    });
    h.addEventListener("click", showHist);
    i.addEventListener("click", closeHist);
    z.addEventListener("click", function(){t.textContent = "";});
}(typing, submitter, submitter_gg, cent_for, _history, _history_bc, typing_clearer);

!function()
{   
    document.getElementById("cent-for").innerHTML = `サイトのリンクをペースト | ${GOOLE}検索`;
    document.getElementById("ggl_btn").innerHTML = GOOLE;
    $(".loading_gif").css("width", $(".cent").height() + 14 + "px");
    $("#typing_clearer").show();
    $(".hist_deleter_x").on("click", function(){
        initOverlay();
        if (getHist().length < 1){
            localStorage.setItem("__history", "[]");
            noticeHist("error", "Error: Nothing to clear.", 5000);
            showHist();
            return;
        }
        localStorage.setItem("__history", "[]");
        noticeHist("success", "Successfully cleared your browsing history.", 5000);
        showHist();
    });
    $("#confirm-clear-closer").on("click", initOverlay);
    $("#confirm-clear-overlay").on("click", initOverlay);
    function initOverlay(){
        $("#confirm-clear-overlay").hide();
        $("body").removeClass("no_scroll");
    }
    var prev_ = getHist();
    setInterval(function(){
        var p = getHist();
        if (prev_.length != p.length && HIST_OPENED)
            showHist();
        prev_ = p;
    }, 15);
}();

/**
 * @param {string} code
*/
function getHTML(code)
{
    $.ajax({
        data: {url: code},
        url: "/fetch-for-ipad",
        type: "POST",
        timeout: 10_000,
    })
    .done(doneCallback)
    .fail(function(){goToSmthWentWrong(code);});
    function doneCallback(data){
        var path = data.iframe;
        var main = document.getElementById("aw");
        var id = data.fy;
        var red = `/view?s=${id}`;
        var view = `http://kanokiw.com/view?s=${id}`;

        addToHist({title: data.title, url: data.url, view: view,
            favicon_url: data.favicon_url, id: id, timestamp: data.timestamp});
        hideLoadingSymbols();
        window.location.href = red;
    }
}


function write_iFrame(path, id)
{
    var main = document.getElementById("aw");
    $(".success_ind").show();
    $(".ghFG").remove();
    $("#cr").hide();
    main.innerHTML = main.innerHTML + `
        <div id="next_dx">
            <a class="success_ind" id="showOnblank" target="_blank">別ページで表示する(全画面)</a>&nbsp;&nbsp;
            <a class="success_ind" href="http://kanokiw.com/">新しいページを取得する</a>
        </div>
        <hr>
        <iframe 
            id="innerIFRAME"
            title="Inline Frame Example"
            frameborder="no"
            height="100"
            src="http://kanokiw.com/find/${id}"></iframe>
    `;
    document.getElementById("showOnblank").href = "http://preview.kanokiw.com/find/"+id;
    $(window).on("load resize",function(){
        $("main").css("width",  $(window).width());
        $("main").css("height",  $(window).height());
    });
}

function goToSmthWentWrong(u)
{
    window.location.href = `/?wrong=wrong&u=${encodeURIComponent(u)}`;
}

function showSmthWentWrong(u)
{
    $("main").hide();
    $("#fail-c").show().css("display", "flex");
    $("#pr_u").html(`<span style="color: white"><span style="color: gray">URL you provided:&nbsp;</span>${u}</span>`);
    $("#cr").hide();
}

function doAnimation(jquerySelectTag, animationClass)
{
    $(jquerySelectTag).removeClass(animationClass);
    setTimeout(() => {$(jquerySelectTag).addClass(animationClass);}, 1);
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

function getHist()
{   
    var d =[];
    try {
        d = JSON.parse(localStorage.getItem("__history"));
        if (!Array.isArray(d))
            throw new Error();
    } catch (e){
        return [];
    }
    return d;
}

function addToHist(jsonData)
{
    var d = getHist();
    d.push(jsonData);
    localStorage.setItem("__history", JSON.stringify(d));
}

function showHist()
{
    var hist = getHist();
    HIST_OPENED = true;
    $("#_typing").hide();
    $(".hist_viewer").show();
    $("#hist_user_display").empty();
    for (var di of hist){
        var title = di.title;
        var url = di.url;
        var view = di.view;
        var favicon_url = di.favicon_url;
        var timestamp = di.timestamp;

        if (favicon_url == null){
            favicon_url = "/img/notFound.png";
        }
        
        $("#hist_user_display").prepend(`
            <li class="hist_element">
                <h3>${timestamp}</h3>
                <div class="hist_main_wrapper">
                    <div class="hist_favicon_wrapper">
                        <img class="hist_favicon" src="${favicon_url}">
                    </div>
                    <div>
                        <span class="hist_title">${title}</span>
                        <div class="hist_url"><a href="${view}">${view}</a></div>
                        <div class="hist_url">Origin: <a href="${url}">${url}</a></div>
                    </div>
                </div>
            </li>
        `);
    }
    if (hist.length < 1){
        $("#hist_user_display").prepend(`
            <li class="hist_element">
                <h3>Hi, here is nothing for you.</h3>
                <h4 style="margin-left: 10px;">Please note that private browsing and deleting your browser history prevent preserving history.</h4>
            </li>
        `);
    } else {
        $("#hist_user_display").append(`
            <li class="hist_element">
                <button class="hist_deleter">
                    <span class="hist_deleter_textContent">Clear history</span>
                </button>
            </li>
        `);
        $(".hist_deleter").on("click", function(){
            $("#confirm-clear-overlay").show();
            $("body").addClass("no_scroll");
        });
    }
}

function noticeHist(mode, message, remainDurtion)
{
    var _html = "";
    if (Number.isNaN(remainDurtion))
        remainDurtion = 3000;
    switch (mode){
        case "success":
            _html = `
                <div class="hist_notifier notifier_at_${notifier_count}" id="hist_event_notifier_success">
                    <img class="hist_notifier_img" src="/img/success.png">
                    <h3 style="margin: 10px 0;">${message}</h3>
                </div>
            `;
            break;
        case "error":
        default:
            _html = `
                <div class="hist_notifier notifier_at_${notifier_count}" id="hist_event_notifier_error">
                    <img class="hist_notifier_img" src="/img/error.png">
                    <h3 style="margin: 10px 0;">${message}</h3>
                </div>
            `;
            break;
    }
    $("#notify_component").prepend(_html);
    var cls = `notifier_at_${notifier_count}`;
    setTimeout(function(){
        $(`.${cls}`).remove();
    }, remainDurtion);
    notifier_count++;
}

function closeHist()
{   
    HIST_OPENED = false;
    $("#_typing").show();
    $(".hist_viewer").hide();
}

function hideLoadingSymbols(){
    $(".loading_gif").hide();
}

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

!function()
{
    var a = document.body.children;
    for (b of Array.from(a)){
        if (!b.tagName == "MAIN"){
            //b.style.display = "none";
        }
    }
}();
