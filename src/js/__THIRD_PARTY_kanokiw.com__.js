!function()
{
    var q = "__history";
    function g(n, u)
    {
        if (!u) u = window.location.href;
        n = n.replace(/[[]]/g, "\$&");
        var r = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)"),
            s = r.exec(u);
        if (!s) return null;
        if (!s[2]) return "";
        return decodeURIComponent(s[2].replace(/\\+/g, " "));
    }
    function v()
    {
        var d =[];
        try {
            d = JSON.parse(localStorage.getItem(q));
            if (!Array.isArray(d))
                throw new Error();
        } catch (e)
        {
            return [];
        }
        return d;
    }
    function z(j)
    {
        var d = v();
        d.push(j);
        localStorage.setItem(q, JSON.stringify(d));
    }
    setInterval(function()
        {
            for (var a of document.getElementsByTagName("a")){
                var h = a.href;
                var t = 0;
                if (h == null || ((typeof h === "string" || h instanceof String) && h.startsWith("http://kanokiw.com")))
                    continue;
                for (var p of ["http", "https"])
                {
                    for (var l of ["co.jp", "com"])
                    {
                        if (
                            h.startsWith(p+"://www.google."+l+"/url")
                            || h.startsWith(p+"://google."+l+"/url")
                        )
                        {
                            var b = h;
                            h = g("url", b);
                            if (h == null)
                                h = g("q", b);
                            h = decodeURIComponent(h);
                            t = !0;
                            break;
                        }
                    }
                    if (t) break;
                }
                var o = parent.location.href;
                var f = "http://kanokiw.com/browse?u="+encodeURIComponent(h);;
                if (o.startsWith("http://preview.kanokiw.com/find/") || o.startsWith("http://kanokiw.com/find/"))
                    f += "&w=fullscreen";
                a.href = f;
                a.target = "_parent";
            }
        },
    15);
    !async function(r)
    {
        if (r){
            var s = new URL(window.location.href).pathname.replace(/\/+$/, "").split("/").pop();
            await fetch("/iframe-data", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: s}),
            })
            .then(function(r)
                {
                    return r.json();
                }
            )
            .then(d)
            .catch(f);
            function d(t)
            {
                console.log(t)
                var view = "http://kanokiw.com/view?s="+s;

                for (var c of v())
                {
                    if (c.id == s)
                        return;
                }
                z({title: t.title, url: t.url, view: view,
                    favicon_url: t.favicon_url, id: s, timestamp: t.timestamp});
            }
            function f(b)
            {
                
            }
        }
    }(g("fb"));
}();