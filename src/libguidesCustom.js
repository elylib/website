$(document).ready(function () {/*
* Will track all outbound links
* If an anchor or area tag (header has area tags) has no href, sets it to notValid string
* Allows to not worry about calling methods on undefined and shtuff
* All strings, all the time
* Kind of like the Null-Object Pattern; not always appropriate, but here?
* Kinda nice
* Checking first character filters out the variety of links that aren't links
* That includes hrefs of #, javascript, mailto, notValid, etc.
*/
    $('a, area').on('click', function trackOutbound() {

        var theURL = $(this).attr('href') || 'notValid';
        var currentURL = document.URL;
        var isInternal = theURL.indexOf('lib.westfield.ma.edu');

        if (isInternal === -1 && theURL.charAt(0) === 'h') {
            ga('send', 'event', 'Outbound Link', currentURL, theURL);
        }
    });

//Track how many times somebody expands one of the side-bar menus
    $('.cmn-label').on('click', function trackContextExpand() {
        var theType = $(this).text();
        ga('send', 'event', 'Side Menu', 'Expand', theType);
    });

//Track how many people actually click through on one of the sibe-bar menu options
    $('.cmn-wrapper a:not(.cmn-label)').on('click', function trackContextSelect() {
        var whichLink = $(this).text();
        ga('send', 'event', 'Side Menu', 'Selection', whichLink);
    });

//Track how many times somebody uses one of the QuickSearch tabs
    $('.tab-links a').on('click', function trackQuickSearchTabs() {
        var whichTab = $(this).text();
        ga('send', 'event', 'QuickSearch Box', 'Tab', whichTab);
    });

//Track QuickSearch searches and what the search term is.
//Can compare with tabs to see if percentage of limited searches
    $('#search-box-form').on('submit', function trackQuickSearchTerms() {
        var searchTerm = $('#query').val();
        var selectedTab = $('.tab-links a.selected').text();
        ga('send', 'event', 'QuickSearch Box', 'Search', searchTerm);
        ga('send', 'event', 'QuickSearch Box', 'Search w/ tab', selectedTab + ' ; ' + searchTerm);
    });

    $('#searchLibrary').on('change', function trackQuickSearchScope() {
        var changedTo = $('#scope option:selected').text();
        ga('send', 'event', 'QuickSearch Box', 'Scope Change', changedTo);
    });

    /*
    * Event delegation
    * div .randomBoxes on page, a and img loaded via asynchronous AJAX
    * Apply click event to .randomBoxes then delegate it to a or img
    * Yay for keeping things tidy with delegation
    */
    $('.randomBoxes').on('click', 'a', function trackRotatorClicks() {
        var theUrl = $(this).attr('href');
        ga('send', 'event', 'Home Page Rotator', 'Click', theUrl);
    });

//Only apply to databases a-z page, no use mucking things up with event listeners everywhere else
    if ($('#s-lg-az-filters').length) {

        $('#s-lg-az-content').on('click', 'a', function trackAZChosen() {
            var theUrl = $(this).text();
            ga('send', 'event', 'Databases A-Z', 'Chosen', theUrl);
        });

        $('select').on('change', function trackAZFilter() {
            var optionSelected = $(this).find('option:selected').text();
            ga('send', 'event', 'Databases A-Z', 'Filter', optionSelected);
        });
    }

    /*
    * Trying to cross-browserly track js errors
    * Part of me feels like this is just going to create errors
    * Part of me feels like I'm polluting this pristine file
    * jQuery .on('error') seems to act kind of wonkey with some errors
    * So sorry for disrupting the flow state on .on's
    */
    function trackJavaScriptError(e) {

        var ie = window.event || {};
        var errMsg = e.message || ie.errorMessage;
        var errSrc = (e.filename || ie.errorUrl) + ': ' + (e.lineno || ie.errorLine);

        ga('send', 'event', 'JavaScript Error', errMsg, errSrc, {'nonInteraction': 1});
    }

    if (window.addEventListener) {

        window.addEventListener('error', trackJavaScriptError, false);

    } else if (window.attachEvent) {

        window.attachEvent('onerror', trackJavaScriptError);

    } else {

        window.onerror = trackJavaScriptError;

    }

//Homepage hours display
    if ($('.cal-wrapper').length) {
        $.ajax({
            url: 'https://api3.libcal.com/api_hours_today.php?iid=969&lid=2844&format=json',
            dataType: 'jsonp',
            success: function calendarAPI(data) {
                /**
                 * curStatus       string   Whether we are currently open or closed
                 * todaysTimes     string   Open and closed times, formatted by API
                 * weAreOpenToday  boolean  Get a true or false to decide if we should show hours
                 *
                 * Call libcal api, get data as JSONP to avoid CORS error
                 * Check and show whether we are currently open
                 * If we are open at all that day, show hours of operation
                 */
                var curStatus = data.locations[0].times.currently_open ? 'Open' : 'Closed';
                var todaysTimes = data.locations[0].rendered;
                var weAreOpenToday = data.locations[0].times.status === 'open' || data.locations[0].times.status === '24hours';

                $('.cal-wrapper').show();
                $('.cal-status').text(curStatus);

                if (weAreOpenToday) {
                    $('.cal-timeWrapper').show();
                    $('.cal-openThroughClose').text(todaysTimes);
                }
            }
        });
    }

    var formatParams = {
        Books: {
            formatInput: 'Book',
            placeholderText: 'Find books...'
        },
        Articles: {
            formatInput: 'Artchap',
            placeholderText: 'Find Articles...'
        },
        Video: {
            formatInput: 'Video',
            placeholderText: 'Find Videos...'
        },
        Everything: {
            formatInput: '',
            placeholderText: 'Find books, videos, music, and more....'
        }
    };

    jQuery('.tab-links a').on('click', function (e) {
        e.preventDefault();
        var currentAttrValue = jQuery(this).text();
        // Show/Hide Tabs
        jQuery('#formatInput').val(formatParams[currentAttrValue].formatInput);
        jQuery('#whatAreWeSearchingFor').text(currentAttrValue);
        jQuery('#query').attr('placeholder', formatParams[currentAttrValue].placeholderText).focus();
        // Change/remove current tab to active
        $('.tab-links a.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#search-box-form').on('submit', function (e) {
        var query = $('#query');
        var chosen = $('#searchLibrary');
        var ercFilter = '((b8:Education Resources Collection) OR (b8:Education Resources Tests) OR (b8:Education Resources Reference))';
        if (chosen.val() === 'erc') {
            if (query.val().indexOf(ercFilter) === -1) {
                chosen.val('wz:5504');
                query.val(query.val() + ' ' + ercFilter);
            }
        }
    });

//Deprecated
//Create functionality for search tabs
    var searchTypes = {
        all: {fq: '', qt: 'affiliate_wcl_all'},
        artchap: {fq: 'x0:artchap', qt: 'affiliate_wcl_art'},
        books: {fq: 'x0:book', qt: 'affiliate_wcl_bks'},
        videos: {fq: 'x0:video', qt: 'affiliate_wcl_video'},
        sourceElements: '<label for="source">Limit to journal/magazine: </label><input name="source" id="source" value="" type="text">',
        setHiddenFields: function (curType) {
            /**
             * curType  string  Selected tab in search box
             * fqOrqt   string  Values within curType object
             *
             * QuickSearch box has hidden form fields, #fq and #qt, that control
             * how searches are done in WorldCat Local
             * When user selects a tab, this code finds the tab they clicked
             * It then goes over and sets the hidden form fields related to that category
             */
            for (var fqOrqt in this[curType]) {
                $('#' + fqOrqt).val(this[curType][fqOrqt]);
            }
        }
    };

    $('.qsb-searchTabs a').on('click', function searchTabFunctionality(e) {
        /**
         * curAnchor      DOM node(s)   The clicked tab
         * otherAnchors   DOM node(s)   The other tabs not clicked
         * typeToSearch   string        The name of the clicked tab
         *
         * When user clicks on a tab in the QuickSearch box
         * set the hidden form fields that control WorldCat searching
         * Apply 'qsb-searchTabSelected' class to selected to apply css
         * Also apply 'qsb-parent' to parent div, also for css styling
         * Remove those classes from the previously selected tab
         * If it's an 'Articles' search, show the 'Limit to Journal' option
         */

        e.preventDefault();

        var curAnchor = $(this);
        var otherAnchors = $('.qsb-searchTabs a').not(curAnchor);
        var typeToSearch = curAnchor.attr('rel');
        var sourceBoxIsDisplayed = $('#source').length;

        //Change the hidden form fields to select search type i.e. books, videos
        searchTypes.setHiddenFields(typeToSearch);

        if (typeToSearch === 'artchap') {
            if (!sourceBoxIsDisplayed) {
                $('#qsb-journalSearch').append(searchTypes.sourceElements);
            }
        } else if (sourceBoxIsDisplayed) {
            $('#qsb-journalSearch').html('');
        }

        curAnchor.addClass('qsb-searchTabSelected');
        otherAnchors.removeClass('qsb-searchTabSelected');

        curAnchor.parent().addClass('qsb-tabParent');
        otherAnchors.parent().removeClass('qsb-tabParent');
    });

//Home guide Context menu expandable menu
    $('.cmn-label').on('click', function contextMenu(e) {
        /**
         * theClicked  string  The name of the chosen menu option
         *
         * Simple click handler to make context menu sidebar (Student - Faculty etc. nav)
         * expandable.
         */

        e.preventDefault();

        var theClicked = $(this).text();
        $('#' + theClicked).slideToggle();
    });

//Feature boxes at the bottom of home page
    if ($('.randomBoxes').length) {

        var randomBoxes = ['//lgapi.libapps.com/widgets.php?site_id=1761&widget_type=8&output_format=1&widget_embed_type=2&guide_id=353931&box_id=7280166&map_id=8565388&content_only=0&config_id=1438623836390', '//lgapi.libapps.com/widgets.php?site_id=1761&widget_type=8&output_format=1&widget_embed_type=2&guide_id=353931&box_id=7280164&map_id=8565386&content_only=0&config_id=1438623867976', '//lgapi.libapps.com/widgets.php?site_id=1761&widget_type=8&output_format=1&widget_embed_type=2&guide_id=353931&box_id=7280397&map_id=8565389&content_only=0&config_id=1438623881406'];

        var whichBox = Math.floor(Math.random() * randomBoxes.length);
        var randomBox = randomBoxes[whichBox];

        $.ajax({
            url: randomBox,
            success: function putRandomBox(data) {
                $('.randomBoxes').append(data);
            }
        });
    }

//Print and Microform guide
    if ($('.pam-notElectronic').length) {
        //Wrap in IIFE to contain scope
        (function () {

            var oclcNum = (document.URL.match(/ocn=\d+/) || [false])[0];

            if (oclcNum) {

                $('.pam-navigatedHere').hide();

                $.ajax({
                    url: 'https://legacy.lib.westfield.ma.edu/oclc_records/getRecord.php?' + oclcNum,
                    dataType: 'jsonp',
                    beforeSend: function () {
                        $('.pam-eJournalLoadSpin').show();
                    },
                    success: function notEHoldingsPage(data) {

                        $('.pam-notElectronic').show();

                        if (data.title) {

                            $('.pam-title').html('<strong>Title</strong>: ' + data.title);
                            $('.pam-holdings').html('<strong>Availability</strong>: ' + data.holdings);

                        } else if (data.statusCode) {
                            ga('send', 'event', 'Print Holdings Page', 'PHP Error', data.statusCode + ' ' + data.wwwAuthenticate + ': ' + data.responseBody);
                        } else {
                            ga('send', 'event', 'Print Holdings Page', 'Record Error', oclcNum + ': ' + data);
                        }
                    },
                    error: function (thingy, error, message) {
                        ga('send', 'event', 'Print Holdings Page', 'AJAX Error', error + ': ' + message);
                    },
                    complete: function () {
                        $('.pam-eJournalLoadSpin').remove();
                    }
                });
            } else {
                ga('send', 'event', 'Print Holdings Page', 'No OCLC Number', document.referrer);
            }
        })();
    }
});