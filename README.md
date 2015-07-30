MKPROJ
--------------------

simple scaffolding tool for making node modules and/or Browserify'd web apps. 

[![NPM](https://nodei.co/npm/mkproj.png)](https://nodei.co/npm/mkproj/)
[![Build Status](https://secure.travis-ci.org/coleww/mkproj.png)](http://travis-ci.org/coleww/mkproj)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

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

From there just CD into the fresh directory and run `npm run watch` to start watchify and also plz fire up a simple HTTPserver ([i like this node module](https://www.npmjs.com/package/serve)) and then you can immediately get started writing NODE IN THE BROWSER ZOMG AWESOME! 

Use index.js to write some sweet functions, 
and test.js to, err, um, test them.
Drop that code into www/demo.js, 
and let those functions fly on index.html.
If you are making a module to publish, be sure to write good documentation in the readme! 


F R E E D O M
