Ely Library Web Files
=====================
Last edited 9-2-15
------------------
If you don't know [*Grunt*](http://gruntjs.com) and don't want to learn *Grunt* (same goes for [*SASS*](http://sass-lang.com)), just get **main.css** and **concatted.js** from their respective **dist** directory and work from those. I use these tools, but don't want to make whoever you are dependent on them.

These files control the customization of our *LibGuides* instance. The minified versions are uploaded into the Custom JS/CSS section of *LibGuides*. *LibGuides* already includes *jQuery*, so all of the *JavaScript* uses *jQuery* because why not, it's already there. Some of these files rely on *PHP* scripts to pull information from APIs. I have tried to note that when it is the case.  

I have endeavored to set up a logical and consistent system. You can be the judge of whether or not that actually happened. A brief rundown on directory structure (should hopefully be apparent, but let's be explicit, shall we?):

+ **.sass-cache** - If you see this folder, ignore it. It's a system-y directory that *SASS* uses to speed the flow of business. 
+ **backup** - on every build, *Grunt* creates a backup of the current **dist** directory. Only the last version is backed up in this way. I could and probably should just do version control with *Git*, and may yet, but for now this is what it is. 
+ **dist** - Distribution files. Each build I create two versions of both the *css* and *js* files, a minified one for uploading and a 'regular' one for human-reading. If you do not intend to continue using *Grunt* and/or *SASS*, these are the files that you will probably want to take to work from as they combine the various files that *Grunt* uses to build the distro files.
+ **node_modules** - Another folder you don't need to worry about. It just houses the actual modules *Grunt* uses.
+ **snippets** - Sometimes I get ideas, they will go here. It's currently empty, may remain empty, but do not think that means I had no ideas! It just means all my ideas were good enough to go into production rather than languish in a test file. Yeah!
+ **src** - The actual files I code in. I try to keep things logically organized in here, breaking things out modularly into files that make sense to me. You can do what you want, but you might have to reconfigure some things in the **Gruntfile.js** or in *SASS* files if you move things around.

If you're curious, the following *Grunt* packages are installed and used in the project. Look in the **Gruntfile** to see the configurations themselves.

+ **jshint** - Lints the *JS* to catch syntax errors, unused functions, undeclared variables, etc.
+ **uglify** - Minify the *JS* so it's as teeny tiny as can be. This also gets rid of all those inane comments I littered the base files with.
+ **concat** - Concatenates all the *JS* files. Kind of boring, really.
+ **sass** - SASS compiler that compiles *css* files from *scss* files and partials. Does its own minification so *uglify* not needed.
+ **copy** - Just copies files and directories. Nothing special, but allows for making backups in the absence of version control.
+ **watch** - Allows for continual monitoring of files for changes as you're editing, so you can compile *SASS* or lint *JS* on the fly. Useful for quickly testing changes.
+ **clean** - Delete everything out of chosen directories. Added in just in case, haven't used it and maybe never will, but if I mess around and start polluting directories with garbage, I can at least quickly clean them out I guess. 
