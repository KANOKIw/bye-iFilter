!function(){
    var q = "__history";
    function g(n, u){
        if (!u) u = window.location.href;
        n = n.replace(/[[]]/g, "\$&");
        var r = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)"),
            s = r.exec(u);
        if (!s) return null;
        if (!s[2]) return "";
        return decodeURIComponent(s[2].replace(/\\+/g, " "));
    }
    function v(){
        var d =[];
        try {
            d = JSON.parse(localStorage.getItem(q));
            if (!Array.isArray(d))
                throw new Error();
        } catch (e){
            return [];
        }
        return d;
    }
    function z(j){
        var d = v();
        d.push(j);
        localStorage.setItem(q, JSON.stringify(d));
    }
    function y(n){
        return n.startsWith("/") || n.startsWith("./");
    }
    function w(m){
        var u = new URL(__ORIGINAL_URL__);
        var d = u.origin;
        if (m.startsWith("//")){
            return "http:"+m;
        } else if (m.startsWith("/")){
            return d+m;
        } else if (m.startsWith("./")){
            return d+__ORIGINAL_URL__.substring(0, __ORIGINAL_URL__.lastIndexOf("/"))+m.slice(1);
        }
        return m;
    }
    setInterval(function(){
        var p = [
            ...document.getElementsByTagName("a"),
            ...document.getElementsByTagName("src"),
            ...document.getElementsByTagName("img"),
            ...document.getElementsByTagName("meta"),
        ];
        var r = new URL(__ORIGINAL_URL__);
        var d = r.origin;
        p.forEach(j => {
            if (j.href && y(j.href))
                j.href = w(j.href);
            if (j.src && y(j.src))
                j.src = w(j.src);
            if (j.content && y(j.content))
                j.content = w(j.content);
        });
        for (var t of document.getElementsByTagName("style")){
            var j = t.innerHTML;
            var l = j;
            j = j.replaceAll(/url\("\/([^\/].+)"\)/g, 'url("' + d + '/$1")');
            j = j.replaceAll(/url\("\.\/(.+)"\)/g, 'url("' + __ORIGINAL_URL__.substring(0, __ORIGINAL_URL__.lastIndexOf("/")) + '/$1")');
            j = j.replaceAll(/url\("\/\/(.+)"\)/g, 'url("' +  r.protocol + '//$1")');
            if (j != l)
                t.innerHTML = j;
        }
        for (var a of document.getElementsByTagName("a")){
            var h = a.href;
            var t = 0;
            if (
                h == null
                || (
                    (
                        typeof h == "string" 
                        || h instanceof String
                    )
                    && h.startsWith("http://kanokiw.com")
                    )
                ) continue;
            for (var p of ["http", "https"]){
                for (var l of ["co.jp", "com"]){
                    if (
                        h.startsWith(p+"://www.google."+l+"/url")
                        || h.startsWith(p+"://google."+l+"/url")
                        || h.startsWith(p+"://www.youtube."+l+"/redirect")
                        || h.startsWith(p+"://youtube."+l+"/redirect")
                    ){
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
            if (
                o.startsWith("http://preview.kanokiw.com/find/")
                || o.startsWith("http://kanokiw.com/find/")
            ){
                f += "&w=fullscreen";
            }
            a.target = "_parent";
            a.href = f;
            a.replaceWith(a.cloneNode(true));
        }
    }, 15);
    !async function(r){
        if (r){
            var s = new URL(window.location.href).pathname.replace(/\/+$/, "").split("/").pop();
            await fetch("/iframe-data", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: s}),
            })
            .then(function(r){
                return r.json();
            })
            .then(d)
            .catch(f);
            function d(t){
                console.log(t)
                var view = "http://kanokiw.com/view?s="+s;

                for (var c of v()){
                    if (c.id == s)
                        return;
                }
                z({title: t.title, url: t.url, view: view,
                    favicon_url: t.favicon_url, id: s, timestamp: t.timestamp});
            }
            function f(b){
                
            }
        }
    }(g("fb"));
}();