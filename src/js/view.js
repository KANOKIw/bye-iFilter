var fb = getParam("fb");

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

if (fb){
    var s = getParam("s");
    $.ajax({
        url: "/iframe-data",
        data: {id: s},
        type: "POST",
        timeout: 10_000,
    })
    .done(d)
    .fail(f);
    function d(data){
        console.log(data)
        var view = `http://kanokiw.com/view?s=${s}`;

        for (var di of getHist()){
            if (di.id == s)
                return;
        }
        addToHist({title: data.title, url: data.url, view: view,
            favicon_url: data.favicon_url, id: s, timestamp: data.timestamp});
    }
    function f(error){
        
    }
}

!function()
{
    var s = getParam("s");

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
        $("#aw").show();
    }
    function f(error){
        document.getElementById("aw").style.display = "none";
        document.getElementById("fail-c").style.display = "none";
        document.getElementById("cr").style.display = "none";
        $("body").append(error.responseText);
        ntf();
    }
}();

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

function ntf(){
    !function(){
        
    }();
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
