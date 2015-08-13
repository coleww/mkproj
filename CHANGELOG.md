CH-CH-CH-CHANGES
----------------------------------------------

8/13/205 v3.2.0
- adds sweet yargs/figlet CLI interface
- adds options for generating browersify/www, twitter-bot, and CLI boilerplate
- new default is to only make index.js and test.js w standard and tap 
- old default is now basically `mkproj project-name -b`

8/10/2015 v3.1.2
- actually fix issue with loading moustache templates that broke everything
- `__dirname` is the magic. I was WAY off on that other thing...

8/10/2015 v3.1.1
- fix issue with loading moustache templates that broke everything
- don't use relative paths in a node module, except in `require()`'s I guess?

8/9/2015 V3.1.0
- remove broken gh-pages script
- add working/tested `gh-pages-deploy` module and config
- convert all file template stuff to moustache