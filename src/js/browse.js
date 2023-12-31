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

!function(w){
    if (w){
        var u = decodeURIComponent(getParam("u"));
        showSmthWentWrong(u);
        throw new Error();
    }
    $("#aw").show();
}(wrong);

!function(){
    var l = window.location.href;
    if (l.includes("?"))
        window.location.href = "/";
    if (l.startsWith("http://preview"))
        window.location.href = "http://kanokiw.com/";
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
        disableButtons();
        var syms = ["\n", " ", "　"];
        for (var s of syms){
            url = url.replaceAll(s, "");
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))){
            url = "http://"+url; // auto redirects to https
        }
        if (url.startsWith("http://www.kanokiw.com")
            || url.startsWith("http://kanokiw.com")
            || url.startsWith("http://preview.kanokiw.com")
            || url.startsWith("http://localhost")
            ){
            goToSmthWentWrong();
        }
        var uk = {origin: ""};
        try{uk = new URL(url);}catch(e){goToSmthWentWrong();}
        if (uk.origin == url)
            url += "/";
        $("#getterBtn").show();
        getSource(url);
    });
    c.addEventListener("click", function(event){
        var q = t.textContent;
        if (q.length < 1){
            doAnimation("#typing_wrapper", "border_warn");
            return;
        }
        disableButtons();
        q = encodeURIComponent(q);
        q = q.replace("%20", "+");
        var url = `https://www.google.co.jp/search?q=${q}&oq=${q}+&sourceid=${getBrowserName()}&client=${getBrowserName()}&ie=UTF-8&oe=UTF-8`;
        if ((new URL(url)).origin == url)
            url += "/";
        $("#googlerBtn").show();
        getSource(url);
    });
    !function(){
        j.innerHTML = `<span id="paste_form_sub_">サイトの&nbsp;<span class="dummy-a">URL</span> | ${GOOLE}検索</span>`;
        document.getElementById("paste_form_sub_").addEventListener("click", function(){
            t.focus();
            doAnimation("#typing_wrapper", "border_notice");
        });
    }();
    h.addEventListener("click", showHist);
    i.addEventListener("click", closeHist);
    z.addEventListener("click", function(){t.textContent = "";});
}(typing, submitter, submitter_gg, cent_for, _history, _history_bc, typing_clearer);

!function()
{   
    document.getElementById("ggl_btn").innerHTML = GOOLE;
    $(".loading_gif").css("height", $(".cent").height() + "px");
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
    function initOverlay(event){
        if (
            event && event.target && event.target.id
            && (
                event.target.id == "confirm-clear-bg-wrapper"
                || event.target.id ==  "confirm-clear-closer"
                || event.target.id == "hist_deleter_x_"
                || event.target.id == "hist_deleter_x__"
            )
        ){
            $("#confirm-clear-overlay").hide();
            $("body").removeClass("no_scroll");
        }
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
function getSource(code)
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
        enableButtons();
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

function hideLoadingSymbols(){
    $(".loading_gif").hide();
}

function disableButtons(excepting){
    Array.from(document.getElementsByClassName("req-btn")).forEach(e => {
        if (e.id != excepting){
            e.classList.add("btn-nw");
        }
    });
}

function enableButtons(excepting){
    Array.from(document.getElementsByClassName("req-btn")).forEach(e => {
        if (e.id != excepting){
            e.classList.remove("btn-nw");
        }
    });
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
