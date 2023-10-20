import os

b = "./.tie_preview_iframes/"
for p in os.listdir("./.tie_preview_iframes/"):
    path = b+p
    match p:
        case ".co.json":
            with open(path, "w") as f:
                f.write("{}")
        case _:
            os.remove(path)
