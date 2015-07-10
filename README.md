MKPROJ
--------------------

simple scaffolding tool for Browserify projects.

[![NPM](https://nodei.co/npm/mkproj.png)](https://nodei.co/npm/mkproj/)

### INSTALL IT

`npm install -g mkproj`

### USE IT

```
    $ mkproj wowowowow
    CREATED: wowowowow/.gitignore
    CREATED: wowowowow/.travis.yml
    CREATED: wowowowow/.npmignore
    CREATED: wowowowow/README.md
    CREATED: wowowowow/index.js
    CREATED: wowowowow/www/demo.js
    CREATED: wowowowow/test.js
    CREATED: wowowowow/www/main.css
    CREATED: wowowowow/index.html
    CREATED: wowowowow/package.json
    wowowowow project created!
                               |        |
                               |\      /|
                               | \____/ |
                               |  /\/\  |
                              .'___  ___`.
                             /  \|/  \|/  \
            _.--------------( ____ __ _____)
         .-' \  -. | | | | | \ ----\/---- /
       .'\  | | / \` | | | |  `.  -'`-  .'
      /`  ` ` '/ / \ | | | | \  `------'\
     /-  `-------.' `-----.       -----. `---.
    (  / | | | |  )/ | | | )/ | | | | | ) | | )
     `._________.'_____,,,/\_______,,,,/_,,,,/
    This utility will walk you through creating a package.json file.
    // ...ETC. etc. etc.
```

After generating the project folder/files, it `cd`'s into the new folder and runs `npm init` and `npm install` and `git init` and `git commit -m "initial"`.

From there run `npm run watch` to start watchify and also plz fire up a simple HTTPserver with yr favorite snake egg or red gem and then you can immediately get started writing NODE IN THE BROWSER ZOMG AWESOME! Use index.js/test.js to write some sweet functions, and then let them loose in yr www/demo.js. Write some sick npm modules and also demo them, or just wail hard on those lego bricks, yeah.

F R E E D O M



