# Elastic News frontend

## Development

The frontend is based on Bootstrap and jQuery, we are using npm modules to call
the elasticsearch api and browserify to bundle everything together.

You'll need Node, npm, babel and browserify to develop, watchify is optional, but nice to have:
```bach
npm install browserify -g
npm install watchify -g
npm install
```

Now just run one of:
```
npm run build
npm run watch
```

## Try it out

Once the js is bundled (check that `bundle.js` exists in the folder),
there are two ways to access the website:

1. **Using chrome to open the file from the filesystem**

   Everything is local, everything is easy, just open `index.html` in the browser.

   On the elasticsearch side just make sure you've enabled CORS, otherwise
   the client's requests will fail.


2. **Serve the website on your local network**

   First we need a web server, with pyton3 installed the quickest way is to run
   this in the folder with `index.html`, it will default to `0.0.0.0:8000`:

   ```bash
   python3 -m http.server
   ```

   From the local machine, just navigate to one of:
   - [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - [http://localhost:8000](http://localhost:8000)

   To access from some other machine in the LAN, you need to know your ip address:

   ```bash
   ifconfig
   ```

   Then use a browser to navigate to `http://<address>:8000`, note that by default
   the javascript client looks up elasticsearch at `localhost` and at the address
   it got the website from, so it might not be able find the server.

   (Use `netstat -tuplen` if you want to check that you have a listening socket
     for the server and one for the elasticsearch server)
