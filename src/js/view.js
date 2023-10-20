
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
        if (Math.random() > 0.25){
            document.getElementById("w").src = "/src/lost/egg.png";
            document.getElementById("HFTFE").src = "/src/lost/HFTFE.mp3";
            document.getElementById("wwv").innerHTML += `
                body {
                    font-family: "dot";
                    background-image: url("/src/lost/back.png");
                    background-repeat: repeat;
                    background-size: 100%;
                    margin: 0;
                    user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none; 
                    -khtml-user-select: none;
                    -moz-user-select: none; 
                    -ms-user-select: none;
                }
            `;
        } else {
            document.getElementById("w").src = "/src/lost/si.png";
            document.getElementById("HFTFE").src = "/src/lost/SDW.mp3";
            document.getElementById("wwv").innerHTML += `
                body {
                    font-family: "dot";
                    background-image: url("/src/lost/st.png");
                    background-repeat: repeat;
                    background-size: 100%;
                    margin: 0;
                    user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none; 
                    -khtml-user-select: none;
                    -moz-user-select: none; 
                    -ms-user-select: none;
                }
            `;
        }
    }();
}
