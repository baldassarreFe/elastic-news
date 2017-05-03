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

And the run:
'''
python3 -m http.server
'''

Now just type http://127.0.0.1:8000/ in web browser
