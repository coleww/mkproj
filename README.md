MKPROJ
--------------------

![welcome 2 hell](construction.png)

simple scaffolding tool for making tiny node modules or big Browserify'd web apps!

[![NPM](https://nodei.co/npm/mkproj.png)](https://nodei.co/npm/mkproj/)
[![Build Status](https://secure.travis-ci.org/coleww/mkproj.png)](http://travis-ci.org/coleww/mkproj)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

### INSTALL IT

`npm install -g mkproj`

### USE IT

```
$ mkproj wat
$$\      $$\       $$\   $$\       $$$$$$$\        $$$$$$$\         $$$$$$\           $$$$$\
$$$\    $$$ |      $$ | $$  |      $$  __$$\       $$  __$$\       $$  __$$\          \__$$ |
$$$$\  $$$$ |      $$ |$$  /       $$ |  $$ |      $$ |  $$ |      $$ /  $$ |            $$ |
$$\$$\$$ $$ |      $$$$$  /        $$$$$$$  |      $$$$$$$  |      $$ |  $$ |            $$ |
$$ \$$$  $$ |      $$  $$<         $$  ____/       $$  __$$<       $$ |  $$ |      $$\   $$ |
$$ |\$  /$$ |      $$ |\$$\        $$ |            $$ |  $$ |      $$ |  $$ |      $$ |  $$ |
$$ | \_/ $$ |      $$ | \$$\       $$ |            $$ |  $$ |       $$$$$$  |      \$$$$$$  |
\__|     \__|      \__|  \__|      \__|            \__|  \__|       \______/        \______/



CREATED: wat/.gitignore
CREATED: wat/.travis.yml
CREATED: wat/.npmignore
CREATED: wat/README.md
CREATED: wat/`package.json`
CREATED: wat/index.js
CREATED: wat/test.js
wat project has been mk'd with  boilerplate!
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
W A Y    C H I L L!               =^.^=            R A D I C A L!
```

After generating the project folder/files, it `cd`'s into the new folder and runs `npm init` and `npm install` and `git init` and `git commit -m "initial"` FOR YOU! NO WORRIES! WE GOT YOU ON THIS ONE!


### ADD BROWSERIFY TO AN EXISTING PROJECT

Just `cd` into any project folder that contains a `package.json`, whether created via `mkproj` or not, and run:

``` 
  mkproj -b
```

This will `npm install` some junk and add modify yr package.json and make a `/www` with some HTML5 and CSS3 boilerplate all good to go

If at any point the module hits a bump in the road due to, say, a file already existing or a duplicate `scripts` entry it will output a helpful error, thus allowing you, the programmer, to rectify this error. 

### THE COMMAND LINE API

```
                                                                                    :
                             G:                                                    t#,
                             E#,    :       t                j.                   ;##W.          itttttttt
            ..       :       E#t  .GE       ED.              EW,                 :#L:WE          fDDK##DDi
           ,W,     .Et       E#t j#K;       E#K:             E##j               .KG  ,#D            t#E
          t##,    ,W#t       E#GK#f         E##W;            E###D.             EE    ;#f           t#E
         L###,   j###t       E##D.          E#E##t           E#jG#W;           f#.     t#i          t#E
       .E#j##,  G#fE#t       E##Wi          E#ti##f          E#t t##f          :#G     GK           t#E
      ;WW; ##,:K#i E#t       E#jL#D:        E#t ;##D.        E#t  :K#E:         ;#L   LW.           t#E
     j#E.  ##f#W,  E#t       E#t ,K#j       E#ELLE##K:       E#KDDDD###i         t#f f#:          jfL#E
   .D#L    ###K:   E#t       E#t   jD       E#L;;;;;;,       E#f,t#Wi,,,          f#D#;           :K##E
  :K#t     ##D.    E#t       j#t            E#t              E#t  ;#W:             G#t              G#E
  ...      #G      ..         ,;            E#t              DWi   ,KK:             t                tE
           j                                                                                          .

generates tiny node projects

Options:
  -b, --browserify, --browser, --bacon      installs browserify/watchify and
                                            adds /www folder           [boolean]
  -n, --noPleaseDoNotInstallThanks, --      skip the whole "npm init/npm install
  noFunnyBusiness                           /git init/initial commit" business
                                                                       [boolean]
  -h, --help                                Show help                  [boolean]

Examples:
  mkproj yr-awesome-vanilla-node-project
  mkproj yr-cool-browser-app -b
  mkproj -b # add /www and browserify to
  an existing project

```

### BROWSERIFY

Browserify is awesome. It lets you use node modules in the browser, and push all yr code to npm. Sweet. Even if you are making a "node module" to publish, you might want to use browserify to create a tiny demo page for your tiny module. Run `npm run watch` to start watchify and also plz fire up a simple HTTPserver ([i like this node module](https://www.npmjs.com/package/serve) though any sort of gem or egg will do) and then you can immediately get started writing NODE IN THE BROWSER ZOMG AWESOME! This also adds gh-pages deploy, which is a pretty sweet way to push yr projects to the cloud for free. Check the config in the `package.json`. [read more about browserify](https://github.com/substack/browserify-handbook)

### STANDARD

`mkproj` installs [standard](https://github.com/feross/standard) on all projects by default. It is ok. Do not fret or gnash those teeth! The semi-colons will be automatically inserted by the computer. This is the first thing that runs if you `npm test`. TBQH, I vastly prefer `function(){}` over `function () {}`, which is what `standard` expects, but hey, I roll with it.

### TAP/TAPE

A `test.js` file will be created for you which requires `tape` if you are using browserify or `tap` if you are not. The only real difference between tape and tap is that the former is for the browser and the latter is for the Node.js. `npm test` will fire off this test file, after running `standard` of course.

### MY DEAR FRIEND, TRAVIS

My close friend [https://travis-ci.org/](Travis) will totally check out your code and run your tests whenever you push to `git` or whatever, all for free. I even put little twitter bots and silly art projects on CI because it is worth getting that extra once-over from my longtime friend, Travis. If yr developing on a macbook and deploying to various linux-based cloud architectures then CI is indispendable for catching all those little edge case environment bugs.

### BADGES

Aww yeah you got some badges in that `README.md`. Yeah you do. Look at those! Just replace the 2 instances of `YR_TRAVIS_USER_NAME` with, umm, your travis user name. Oh also if you are publishing or distributing your project _please for the love of glob write an appropriate amount of documentation in yr `README.md`_, thanks. 

### CONFIG

There are a few configuration things that mkproj just can't possibly guess, and for that you can create a `~/.mkproj.json` file. Mine looks like this:

```
{
  "githubUserName": "coleww",
  "website": "www.colewillsea.com",
  "travisUserName": "coleww"
}
```

This basically handles personal stuff for the `README.md` and `www/index.html` files, but more awesome tricks might be possible with a little JSON.


### DEVELOPMENT

'mkproj' creates a dummy index.js as well as a tap/tape smokescreen test suite as part of its regular due course of use. When testing this module, it generates a dummy app and makes assertions against the result, but it also copies the `tests/{tap,tape}_modules` directory into the generated test directory, and then runs the test suite that is generated by the test suite. [META-TDD, AWWW YEAH.](http://www.colewillsea.com/blog/test-yr-test-suite) 
