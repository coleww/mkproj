MKPROJ
--------------------

simple scaffolding tool for Browserify projects.

[![NPM](https://nodei.co/npm/mkproj.png)](https://nodei.co/npm/mkproj/)

### INSTALL IT

`npm install -g mkproj`

### USE IT

```
    $ mkproj wowowowow
    CREATED: wowowowow/main.css
    CREATED: wowowowow/.gitignore
    CREATED: wowowowow/index.js
    CREATED: wowowowow/README.md
    CREATED: wowowowow/index.html
    CREATED: wowowowow/package.json
    wowowowow project created!
    This utility will walk you through creating a package.json file.
    It only covers the most common items, and tries to guess sane defaults.
    // ...ETC. etc. etc.
```

After generating the project folder/files, it `cd`'s into the new folder and runs `npm init` and `npm install`.

From there, run `npm run watch` to start Watchify, and you can immediately get started writing NODE IN THE BROWSER ZOMG!

### WHY

I make enough small browserified javascript toys that it started to get annoying to copy over the html5 boiler plate and `echo /node_modules > .gitignore` and etc. This just does it all for me/you, saving literally MINUTES of time.

