Ely Library Web Files
=====================
Last edited 9-20-2018
------------------

These files control all our customizations for Ely Library's web presence. I have gone through and simplified and removed dead code. Look back in the history if you want to see the Grunt based project previously. The customizations and code we use though don't warrant the larger structure I built, so I slimmed it down.

The things run by the JS file are:
1. QuickSearch box - tabs and special searches
2. LibCal hours on homepage
3. The page to show information on print and microform periodicals
4. The context menu on the left of the homepage
5. The 'random' boxes at the bottom of the homepage
6. A number of Google Analytics event listeners

The CSS file is fairly straightforward mostly. Some of the weirdness in it is because we are in some cases holding together an older layout from LibGuides that is no longer the default (and in some cases breaks the default). So some of the things, like the styles on .nav-tabs and such, are to keep he general layout consistent with how it used to look.
