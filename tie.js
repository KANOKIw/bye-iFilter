var typing = document.getElementById("typing");
var _hr = document.getElementById("cent-a_");
var submitter = document.getElementById("cent-submit");
var submitter_gg = document.getElementById("cent-gg");
var cent_for = document.getElementById("cent-for");
var wrong = getParam("wrong");
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

!function(t, s, c, j)
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
        if (url.startsWith("https://www.google.co.jp/url") || url.startsWith("https://www.google.com/url")){  // i-filter base url
            url = decodeURI(getParam("url", url));
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))){
            url = "http://"+url; // auto redirects to https
        }
        if (url.startsWith("http://www.kanokiw.com")
            || url.startsWith("http://kanokiw.com")
            || url.startsWith("http://preview.kanokiw.com")
            ){
            goToSmthWentWrong();
        }
        if ((new URL(url)).origin == url)
            url += "/";
        getHTML(url);
    });
    c.addEventListener("click", function(event){
        var q = t.textContent;
        if (q.length < 1){
            doAnimation("#typing_wrapper", "border_warn");
            return;
        }
        q = q.replace(" ", "+");
        q = encodeURI(q);
        var url = `https://www.google.co.jp/search?q=${q}&oq=${q}+&sourceid=${getBrowserName()}&client=${getBrowserName()}&ie=UTF-8&oe=UTF-8`;
        if ((new URL(url)).origin == url)
            url += "/";
        getHTML(url);
    });
    j.addEventListener("click", function(){
        t.focus();
        doAnimation("#typing_wrapper", "border_notice");
    });
}(typing, submitter, submitter_gg, cent_for);

!function()
{
    document.getElementById("cent-for").innerHTML = `サイトのリンクをペースト | ${GOOLE}検索`;
    document.getElementById("ggl_btn").innerHTML = GOOLE;
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
        var red = `/?s=${id}`;
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
    $(window).on('load resize',function(){
        $("main").css("width",  $(window).width());
        $("main").css("height",  $(window).height());
    });
}

function goToSmthWentWrong(u)
{
    window.location.href = `/?wrong=wrong&u=${encodeURI(u)}`;
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

!function()
{
    var a = document.body.children;
    for (b of Array.from(a)){
        if (!b.tagName == "MAIN"){
            //b.style.display = "none";
        }
    }
}();