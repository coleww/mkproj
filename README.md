MKPROJ
--------------------

![welcome 2 hell](construction.png)

simple scaffolding tool for making node modules and/or Browserify'd web apps and/or twitter bots and/or CLI tools, or any combination thereof, and also for adding any of these aformentioned things to any existing project that has a `package.json` file. 

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


### ADD TO AN EXISTING PROJECT

Just `cd` into any project folder that contains a `package.json`, whether created via `mkproj` or not, and run:

``` 
  mkproj -t
```

`mkproj` will add some twitter bot config files and boilerplate and install the `twit` module and even add a `tweet` entry to the `scripts` in yr `package.json`. It will even guess a good variable name to use for your module ;).

If at any point the module hits a bump in the road due to, say, a file already existing or a duplicate `scripts` entry it will output a helpful error, thus allowing you, the programmer, to rectify this error. 

### THE COMMAND LINE API

```
::::    ::::       :::    :::      :::::::::       :::::::::        ::::::::       :::::::::::
+:+:+: :+:+:+      :+:   :+:       :+:    :+:      :+:    :+:      :+:    :+:          :+:
+:+ +:+:+ +:+      +:+  +:+        +:+    +:+      +:+    +:+      +:+    +:+          +:+
+#+  +:+  +#+      +#++:++         +#++:++#+       +#++:++#:       +#+    +:+          +#+
+#+       +#+      +#+  +#+        +#+             +#+    +#+      +#+    +#+          +#+
#+#       #+#      #+#   #+#       #+#             #+#    #+#      #+#    #+#      #+# #+#
###       ###      ###    ###      ###             ###    ###       ########        #####
generates tiny node projects

Options:
  -b, --browserify, --browser, --bacon  installs browserify/watchify and adds /
                                        www folder
  -c, --cli, --cmd, -l, --lettuce       installs yargs and adds cmd.js file
  -t, --twitter, --tweet, --tomato      installs twit and adds tweet.js file
  -n, --noPleaseDoNotInstallThanks      skip the whole "npm init/npm install/git
                                        init/initial commit" business
  -h, --help                            Show help                      [boolean]

Examples:
  mkproj yr-awesome-vanilla-node-project
  mkproj yr-cool-twitter-bot -tweet
  mkproj make-me-a-sandwich-please -blt
  mkproj -b # add /www and browserify to an existing project

```

### BROWSERIFY

Browserify is awesome. It lets you use node modules in the browser, and push all yr code to npm. Sweet. Even if you are making a "node module" to publish, you might want to use browserify to create a tiny demo page for your tiny module. Run `npm run watch` to start watchify and also plz fire up a simple HTTPserver ([i like this node module](https://www.npmjs.com/package/serve) though any sort of gem or egg will do) and then you can immediately get started writing NODE IN THE BROWSER ZOMG AWESOME! This also adds gh-pages deploy, which is a pretty sweet way to push yr projects to the cloud for free. Check the config in the `package.json`. [read more about browserify](https://github.com/substack/browserify-handbook)

### TWITTER

Every time I make a twitter bot I have to google "node [twit](https://github.com/ttezel/twit)" and copy paste the boilerplate setup with the access tokens and whatnot. NEVER MORE. Add your keys to tweet.js and "business logic" to bot.js, and call `npm run tweet` on a cronjob or something. [an example node twitter bot](https://github.com/dariusk/examplebot)

### CLI

By using some [yargs](https://github.com/bcoe/yargs) boilerplate, we are reminded to write good documentation for our CLI tool, so that when it fails or someone passes `-h` or `-help` or `-ohMyWhatIsGoingOnHere`, people will get a helpful message instead of abstract garbage. The code inside `cmd.js` is setup to do stuff like `yrModule -i 1000 wowowowowow ok cool` as well as pipey stuff like `cat index.js | yrModule -i 5000`. [read more about node CLI magics here](http://www.colewillsea.com/blog/npm-cli) This option also adds a `bin` entry to yr `package.json` so that when someone `npm install -g`s it they will have yr module available on their path. If your module only makes sense as a command line tool, add `"preferGlobal": true` to yr `package.json` as well.

### STANDARD

`mkproj` installs [standard](https://github.com/feross/standard) on all projects by default. It is ok. Do not fret or gnash those teeth! The semi-colons will be automatically inserted by the computer. This is the first thing that runs if you `npm test`. TBQH, I vastly prefer `function(){}` over `function () {}`, which is what `standard` expects, but hey, I roll with it.

### TAP/TAPE

A `test.js` file will be created for you which requires `tape` if you are using browserify or `tap` if you are not. The only real difference between tape and tap is that the former is for the browser and the latter is for the Node.js. `npm test` will fire off this test file, after running `standard` of course.

### MY DEAR FRIEND, TRAVIS

My close friend [https://travis-ci.org/](Travis) will totally check out your code and run your tests whenever you push to `git` or whatever, all for free. I even put little twitter bots and silly art projects on CI because it is worth getting that extra once-over from my longtime friend, Travis. If yr developing on a macbook and deploying to various linux-based cloud architectures then CI is indispendable for catching all those little edge case environment bugs.

### BADGES

Aww yeah you got some badges in that `README.md`. Yeah you do. Look at those! Just replace the 2 instances of `YR_TRAVIS_USER_NAME` with, umm, your travis user name. Oh also if you are publishing or distributing your project _please for the love of glob write an appropriate amount of documentation in yr `README.md`_, thanks. 
 
### A BLT

Some node modules are so awesome that they deserve to be not only balled up into a tar and sent to npm, but also browserified into a web app, bundled into a command line tool, and deployed as a twitter bot. These modules are known colloquially as "whoppers", "ham-sandwiches", or "BLT's", and when we generate one we use the argument `mkproj someProject -blt`. I have never personally made nor witnessed a BLT so unfortunately I cannot link you to an example, but I can dream on, glob willing...

## F R E E D O M

`npm publish`

### DEVELOPMENT

'mkproj' creates a dummy index.js as well as a tap/tape smokescreen test suite as part of its regular due course of use. When testing this module, it generates a dummy app and makes assertions against the result, but it also copies the `tests/{tap,tape}_modules` directory into the generated test directory, and then runs the test suite that is generated by the test suite. [META-TDD, AWWW YEAH.](http://www.colewillsea.com/blog/test-yr-test-suite) 
