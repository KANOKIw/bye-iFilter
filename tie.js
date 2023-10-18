var typing = document.getElementById("typing");
var _hr = document.getElementById("cent-a_");
var submitter = document.getElementById("cent-submit");
var wrong = getParam("wrong");

if (wrong){
    showSmthWentWrong();
    throw new Error();
}

function getParam(name, url) {
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
    if (s){
        $.ajax({
            url: "/iframe/"+s,
            type: "GET",
        })
        .done(d)
        .fail(f)
        function d(data){
            var path = data.path;
            var u = data.url;
            var a = "";
            if (u.startsWith("http://")){
                var ex = "https"+u.slice(4);
                a = `<a href="${u}">${u}</a><span style="color:  var(--color-primary);;">&nbsp;|&nbsp;</span><a href="${ex}">${ex}</a>`
            } else {
                a = `<a href="${u}">${u}</a>`;
            }
            write_iFrame(path, s);
            $("#typing").html(a).attr("contenteditable", "false");
        }
        function f(){
            
        }
    }
}();

!function(t, s){
    t.addEventListener("input", function(event){
        var inner = this.textContent;
    });
    s.addEventListener("click", function(event){
        var url = t.textContent;
        var syms = ["\n", " ", "　"];
        for (var s of syms){
            url = url.replaceAll(s, "");
        }
        if (url.startsWith("https://www.google.co.jp/url") || url.startsWith("https://www.google.com/url")){
            var rps = {
                "%2F": "/",
                "%3A": ":",
            }
            url = getParam("url", url);
            for (var k in rps){
                url = url.replaceAll(k, rps[k]);
            }
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))){
            url = "http://"+url; // auto redirects to https
        }
        getHTML(url);
    });
}(typing, submitter);

!function(){
    document.getElementById("cent-for").textContent = "サイトのリンクをペースト";
}();

/**
 * @param {string} code
*/
function getHTML(code){
    $.ajax({
        data: {url: code},
        url: "/fetch-for-ipad",
        type: "POST",
    })
    .done(doneCallback)
    .fail(goSmthWentWrong);
    function doneCallback(data){
        var path = data.iframe;
        var main = document.getElementById("aw");
        var id = data.fy;
        var red = `/?s=${id}`
        window.location.href = red;
    }
}


function write_iFrame(path, id){
    var main = document.getElementById("aw");
    $(".success_ind").show();
    $(".ghFG").remove();
    main.innerHTML = main.innerHTML + `
        <div id="next_dx">
            <a class="success_ind" id="showOnblank" target=”_blank”>別ページで表示する(全画面)</a>&nbsp;&nbsp;
            <a class="success_ind" href="http://kanokiw.com/">新しいページを取得する</a>
        </div>
        <hr>
        <iframe 
            id="innerIFRAME"
            title="Inline Frame Example"
            frameborder="no"
            height="100"
            src="${path}"></iframe>
    `;
    document.getElementById("showOnblank").href = "http://preview.kanokiw.com/find/"+id;
    $(window).on('load resize',function(){
        $('main').css('width',  $(window).width());
        $('main').css('height',  $(window).height());
    });
}

function goSmthWentWrong(){
    window.location.href = "/?wrong=wrong"
}

function showSmthWentWrong(){
    $("main").hide();
    $("#fail-c").show().css("display", "flex");
}
!function(){
    var a = document.body.children;
    for (b of Array.from(a)){
        if (!b.tagName == "MAIN"){
            //b.style.display = "none";
        }
    }
}();