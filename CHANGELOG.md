CH-CH-CH-CHANGES
----------------------------------------------

10//2015 v5.0.0
- FIVE OH: THE POLICE RELEASE
- adds generators for http server, web audio synth, web spider, leveldb, tap/test, and node-canvas
- adds `-v` flag. whoops.
- better and more professional error handling

9/5/2015 v4.2.5
- handle errors better at the cmd.js level
- allow creating a new project inside of an existing project.

9/2/2015 v4.2.4
- update the args to all be booleans, making `mproj -t foobar` work properly
- use project name wherever possible since we, like, know what it is
- add ability to use a `.mkproj.json` file for configuration
- properly handle if the user passes no meaningful options whatsoever
- add warnings re: whats happening if user passes -n/not hitting the network

8/16/2015 v4.2.0
- sweetens up CLI with more cats and cooler fonts
- adds ability to add stuff to a created project, i.e, by running `mkproj -c` to get a cmd.js
- adds process.exit to generated cmd.js and bin boilerplate to package.json for CLI generations
- adds tweet script when tooting
- add process.exit to internal cmd.js
- adds lettuce to the bacon and tomato
- better error throwing in bad cases
- gets missing name error test working

8/13/2015 v3.2.0
- adds sweet yargs/figlet CLI interface
- adds options for generating browersify/www, twitter-bot, and CLI boilerplate
- new default is to only make index.js and test.js w/ standard and tap 
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