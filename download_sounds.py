import urllib.request
import os

sounds = {
    "fireplace.ogg": "https://upload.wikimedia.org/wikipedia/commons/4/46/Fire_Sounds.ogg",
    "rain.ogg": "https://upload.wikimedia.org/wikipedia/commons/2/23/Rain_in_the_suburbs.ogg",
    "page_turn.ogg": "https://upload.wikimedia.org/wikipedia/commons/1/14/Page_turn.ogg",
    "chime.ogg": "https://upload.wikimedia.org/wikipedia/commons/5/58/Tibetan_singing_bowl.ogg"
}

os.makedirs("public/sounds", exist_ok=True)

for name, url in sounds.items():
    path = f"public/sounds/{name}"
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Saved {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
