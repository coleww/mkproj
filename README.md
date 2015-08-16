MKPROJ
--------------------

![welcome 2 hell](construction.png)

simple scaffolding tool for making node modules and/or Browserify'd web apps and/or twitter bots and/or CLI tools, or any combination thereof. 

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
CREATED: wat/package.json
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






### THE COMMAND LINE API

```
  __  __   _  __  ____    ____     ___        _
 |  \/  | | |/ / |  _ \  |  _ \   / _ \      | |
 | |\/| | | ' /  | |_) | | |_) | | | | |  _  | |
 | |  | | | . \  |  __/  |  _ <  | |_| | | |_| |
 |_|  |_| |_|\_\ |_|     |_| \_\  \___/   \___/

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
  mkproj yr-cool-twitter-bpt -tweet
  mkproj make-me-a-sandwich-please -blt

```

### BROWSERIFY

Browserify is awesome. It lets you use node modules in the browser, and push all yr code to npm. Sweet. Even if you are making a "node module" to publish, you might want to use browserify to create a tiny demo page for your tiny module. Run `npm run watch` to start watchify and also plz fire up a simple HTTPserver ([i like this node module](https://www.npmjs.com/package/serve) though any sort of gem or egg will do) and then you can immediately get started writing NODE IN THE BROWSER ZOMG AWESOME! This also adds gh-pages deploy, which is a pretty sweet way to push yr projects to the cloud for free. Check the config in the package.json. [read more about browserify](https://github.com/substack/browserify-handbook)

### TWITTER

Every time I make a twitter bot I have to google "node twit" and copy paste the boilerplate setup with the access tokens and whatnot. NEVER MORE. Add your keys to tweet.js and "business logic" to bot.js, and call bot.js on a cronjob or something. [an example node twitter bot](https://github.com/dariusk/examplebot)

### CLI

By using some Yargs boilerplate, we are reminded to write good documentation for our CLI tool, so that when it fails people will get a helpful message instead of abstract garbage. The code inside cmd.js is setup to do stuff like `yrModule -i 1000 wowowowowow ok cool` as well as pipey stuff like `cat index.js | yrModule -i 5000`. [read more about node CLI stuff here](http://www.colewillsea.com/blog/npm-cli)

### A BLT

Some node modules are so awesome that they deserve to be not only balled up into a tar and sent to npm, but also browserified into a web app, bundled into a command line tool, and deployed as a twitter bot. These modules are known colloquially as "whoppers", "ham-sandwiches", or "BLT's", and when we generate one we use the argument `mkproj someProject -blt`. I have never personally made nor witnessed a BLT so unfortunately I cannot link you to an example, but I can dream on, glob willing...

## F R E E D O M

`npm publish`

### DEVELOPMENT

This generator creates a dummy index.js as well as a tap/tape smokescreen test suite as part of its output. When testing this module, it also copies the test_modules directory (nasty, ugh) into the generated test directory, so that we can run the test suited generated by the test suite. [META-TDD, AWWW YEAH.](http://www.colewillsea.com/blog/test-yr-test-suite)
