import os

b = "./.tie_preview_iframes/"
for p in os.listdir(b):
    path = b+p
    match p:
        case ".co.json":
            with open(path, "w") as f:
                f.write("{}")
        case _:
            try:
                os.remove(path)
            except PermissionError: ...

for g in os.listdir(b+"rawTXT/"):
    os.remove(b+"rawTXT/"+g)
