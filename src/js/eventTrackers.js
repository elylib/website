/*
* Will track all outbound links
* If an anchor or area tag (header has area tags) has no href, sets it to notValid string
* Allows to not worry about calling methods on undefined and shtuff
* All strings, all the time
* Kind of like the Null-Object Pattern; not always appropriate, but here?
* Kinda nice
* Checking first character filters out the variety of links that aren't links
* That includes hrefs of #, javascript, mailto, notValid, etc.
*/
$( 'a, area' ).on( 'click', function trackOutbound() {

    var theURL = $( this ).attr( 'href' ) || 'notValid';
    var currentURL = document.URL;
    var isInternal = theURL.indexOf( 'lib.westfield.ma.edu' );

    if ( isInternal === -1 && theURL.charAt( 0 ) === 'h' ) {
        ga( 'send', 'event', 'Outbound Link', currentURL, theURL );
    }
});

//Track how many times somebody expands one of the side-bar menus
$( '.cmn-label' ).on( 'click', function trackContextExpand() {
    var theType = $( this ).text();
    ga( 'send', 'event', 'Side Menu', 'Expand', theType );
});

//Track how many people actually click through on one of the sibe-bar menu options
$( '.cmn-wrapper a:not(.cmn-label)' ).on( 'click', function trackContextSelect() {
    var whichLink = $( this ).text();
    ga( 'send', 'event', 'Side Menu', 'Selection', whichLink );
});

//Track how many times somebody uses one of the QuickSearch tabs
$( '.qsb-searchTabs a' ).on( 'click', function trackQuickSearchTabs() {
    var whichTab = $( this ).text();
    ga( 'send', 'event', 'QuickSearch Box', 'Tab', whichTab );
});

//Track QuickSearch searches and what the search term is.
//Can compare with tabs to see if percentage of limited searches
$( '#wcfw' ).on( 'submit', function trackQuickSearchTerms() {
    var searchTerm = $( '#q' ).val();
    ga( 'send', 'event', 'QuickSearch Box', 'Search', searchTerm );
});

$( '#scope' ).on( 'change', function trackQuickSearchScope() {
    var changedTo = $( '#scope option:selected' ).text();
    ga( 'send', 'event', 'QuickSearch Box', 'Scope Change', changedTo );
});

/*
* Event delegation
* div .randomBoxes on page, a and img loaded via asynchronous AJAX
* Apply click event to .randomBoxes then delegate it to a or img
* Yay for keeping things tidy with delegation
*/
$( '.randomBoxes' ).on( 'click', 'a', function trackRotatorClicks() {
    var theUrl = $( this ).attr( 'href' );
    ga( 'send', 'event', 'Home Page Rotator', 'Click', theUrl );
});

//Only apply to databases a-z page, no use mucking things up with event listeners everywhere else
if ( $( '#s-lg-az-filters' ).length ) {

    $( '#s-lg-az-content' ).on( 'click', 'a', function trackAZChosen() {
        var theUrl = $( this ).text();
        ga( 'send', 'event', 'Databases A-Z', 'Chosen', theUrl);
    });

    $( 'select' ).on( 'change', function trackAZFilter() {
        var optionSelected = $( this ).find( 'option:selected' ).text();
        ga( 'send', 'event', 'Databases A-Z', 'Filter', optionSelected );
    });
}

/*
* Trying to cross-browserly track js errors
* Part of me feels like this is just going to create errors
* Part of me feels like I'm polluting this pristine file
* jQuery .on('error') seems to act kind of wonkey with some errors
* So sorry for disrupting the flow state on .on's
*/
function trackJavaScriptError( e ) {

    var ie = window.event || {};
    var errMsg = e.message || ie.errorMessage;
    var errSrc = ( e.filename || ie.errorUrl ) + ': ' + ( e.lineno || ie.errorLine );

    ga( 'send', 'event', 'JavaScript Error', errMsg, errSrc, { 'nonInteraction': 1 } );
}

if ( window.addEventListener ) {

    window.addEventListener( 'error', trackJavaScriptError, false );

} else if ( window.attachEvent ) {

    window.attachEvent( 'onerror', trackJavaScriptError );

} else {

    window.onerror = trackJavaScriptError;

}
