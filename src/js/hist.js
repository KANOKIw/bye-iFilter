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
                    <div class="hist_favicon_wrapper private">
                        <img class="hist_favicon private" src="${favicon_url}" onError='this.onerror=null;this.src="/img/notFound.png";' alt="favicon">
                    </div>
                    <div class="hist_det">
                        <span class="hist_title det_elm">${title}</span>
                        <span class="hist_url det_elm"><a href="${view}">${view}</a></span>
                        <span class="hist_url det_elm">Origin: <a href="${url}" target="_blank">${url}</a></span>
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
        $("#hist_user_display").prepend(`
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
    $("#hist_user_display").prepend(`
        <span style="display: none" aria-hidden="true">上矢印・下矢印キーを使って履歴を素早く確認しましょう。履歴じゃないものも混ざっていますが(笑)</span>
    `);
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
