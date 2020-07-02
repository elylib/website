//Set variable to control flow during COVID-19 pandemic
var pandemicEffect = false;

jQuery(document).ready(function () {
//Homepage hours display
    if (jQuery('.cal-wrapper').length) {
        jQuery.ajax({
            url: 'https://api3.libcal.com/api_hours_today.php?iid=969&lid=2844&format=json',
            dataType: 'jsonp'
        }).then(function calendarAPI(data) {
            /**
             * curStatus       string   Whether we are currently open or closed
             * weAreOpenToday  boolean  Get a true or false to decide if we should show hours
             *
             * Call libcal api, get data as JSONP to avoid CORS error
             * Check and show whether we are currently open
             * If we are open at all that day, show hours of operation
             */
            var elyLibraryHours = data.locations[0];
            var curStatus = elyLibraryHours.times.currently_open ? 'Open' : 'Closed';
            var weAreOpenToday = elyLibraryHours.times.status === 'open' || elyLibraryHours.times.status === '24hours';

            jQuery('.cal-status').text(curStatus);
            jQuery('.cal-wrapper').show();

            if (weAreOpenToday) {
                jQuery('.cal-openThroughClose').text(elyLibraryHours.rendered);
                jQuery('.cal-timeWrapper').show();
            }
        });
    }

//QuickSearch Box
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
            formatInput: 'all',
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
        jQuery('.tab-links a.selected').removeClass('selected');
        jQuery(this).addClass('selected');
    });

    jQuery('#search-box-form').on('submit', function (e) {
        var query = jQuery('#query');
        var chosen = jQuery('#searchLibrary');
        var ercFilter = '((b8:Education Resources Collection) OR (b8:Education Resources Tests) OR (b8:Education Resources Reference))';
        if (chosen.val() === 'erc' && query.val().indexOf(ercFilter) === -1) {
            chosen.val('wz:5504');
            query.val(query.val() + ' ' + ercFilter);
        }
    });

//Home guide Context menu expandable menu
    jQuery('.cmn-label').on('click', function contextMenu(e) {
        /**
         * theClicked  string  The name of the chosen menu option
         *
         * Simple click handler to make context menu sidebar (Student - Faculty etc. nav)
         * expandable.
         */

        e.preventDefault();

        var theClicked = jQuery(this).text();
        jQuery('#' + theClicked).slideToggle();
    });

//Feature boxes at the bottom of home page
    var boxesAtBottomOfHomepage = [
        {
            title: 'AirMedia',
            href: 'https://lib.westfield.ma.edu/airmedia',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/air_media_image_copy.jpg',
            imgAlt: 'Students Using AirMedia'
        },
        {
            title: 'Films On Demand',
            href: 'https://scroll.lib.westfield.ma.edu/login?url=http://fod.infobase.com/p_Home.aspx',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/films-on-demand.jpg',
            imgAlt: 'Films On Demand Logo'
        },
        {
            title: 'Google Scholar',
            href: 'https://lib.westfield.ma.edu/googlescholar',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/google_scholar_rotate_3.jpg',
            imgAlt: 'Google Scholar Logo'
        },
        {
            title: 'Ely University Archives',
            href: 'https://lib.westfield.ma.edu/archives',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/archives-image-homepage.jpg',
            imgAlt: 'Female athletes lounge in a black and white photograph'
        },
        {
            title: 'Read Posters',
            href: 'https://westfield-ma.libsurveys.com/poster',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/Fall_2016_-_Mike_and_Mailroom_staff.jpg',
            imgAlt: 'Mailroom staff pose with reading material.'
        },
        {
            title: 'Buzz Hoagland Site',
            href: 'https://lib.westfield.ma.edu/hoagland',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/buzz.jpg',
            imgAlt: 'Buzz Hoagland teaching at Westfield State University'

        },
        {
            title: 'Coronavirus Online Resources',
            href: 'https://news.nnlm.gov/gmr/2020/02/covid-19-coronavirus-for-public-libraries/',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/Covid-19-Online-Resources.png',
            imgAlt: 'A Guide to COVID-19 (coronavirus disease 2019) for Public Libraries'
        },
        {
            title: 'COVID-19 Publishers Expanded Access',
            href: 'https://lib.westfield.ma.edu/expandedaccessSP2020',
            imgSrc: 'https://libapps.s3.amazonaws.com/customers/1692/images/COVID-19_Publishers-Expanded-Access.png',
            imgAlt: 'A Guide to resources publishers have made temporarily available.'
        }
    ];

    if (jQuery('.newRandomBoxes').length) {
        if (pandemicEffect) {
            var random1 = 7;
            }
        else {
            var random1 = Math.floor(Math.random() * boxesAtBottomOfHomepage.length);
            }
        var random2 = Math.floor(Math.random() * boxesAtBottomOfHomepage.length);
        while (random1 === random2) {
            // Make sure we show two distinct images
            random2 = Math.floor(Math.random() * boxesAtBottomOfHomepage.length);
        }
        var img1 = boxesAtBottomOfHomepage[random1];
        var img2 = boxesAtBottomOfHomepage[random2];

        jQuery('#randomBoxesA1').attr('href', img1.href);
        jQuery('#randomBoxesImg1').attr('src', img1.imgSrc).attr('alt', img1.imgAlt);
        jQuery('#randomBoxesA2').attr('href', img2.href);
        jQuery('#randomBoxesImg2').attr('src', img2.imgSrc).attr('alt', img2.imgAlt);
        jQuery('.newRandomBoxes').removeClass('hidden');
    }

//Print and Microform guide
    if (jQuery('.pam-notElectronic').length) {
        // .match returns an array of matches, so if it fails put false in an array, then pull
        // out the first element of whichever array exists. A kind of confusing way to check
        // for existence and pull value at same time.
        var oclcNum = (document.URL.match(/ocn=\d+/) || [false])[0];
        if (oclcNum) {
            jQuery('.pam-navigatedHere').hide();
            jQuery('.pam-eJournalLoadSpin').show();
            jQuery.ajax({
                url: 'https://legacy.lib.westfield.ma.edu/oclc_records/getRecord.php?' + oclcNum,
                dataType: 'jsonp'
            }).then(function (data) {
                jQuery('.pam-eJournalLoadSpin').remove();
                jQuery('.pam-notElectronic').show();
                if (data.title) {
                    jQuery('.pam-title').text(data.title);
                    jQuery('.pam-holdings').text(data.holdings);
                }
            })
        }
    }

    /*
     * Will track all outbound links
     * If an anchor or area tag (header has area tags) has no href, sets it to notValid string
     * Allows to not worry about calling methods on undefined and shtuff
     * All strings, all the time
     * Kind of like the Null-Object Pattern; not always appropriate, but here?
     * Checking first character filters out the variety of links that aren't links
     * That includes hrefs of #, javascript, mailto, notValid, etc.
     */
    jQuery('a, area').on('click', function trackOutbound() {

        var theURL = jQuery(this).attr('href') || 'notValid';
        var currentURL = document.URL;
        var isInternal = theURL.indexOf('lib.westfield.ma.edu');

        if (isInternal === -1 && theURL.charAt(0) === 'h') {
            ga('send', 'event', 'Outbound Link', currentURL, theURL);
        }
    });

//Track how many times somebody expands one of the side-bar menus
    jQuery('.cmn-label').on('click', function trackContextExpand() {
        var theType = jQuery(this).text();
        ga('send', 'event', 'Side Menu', 'Expand', theType);
    });

//Track how many people actually click through on one of the sibe-bar menu options
    jQuery('.cmn-wrapper a:not(.cmn-label)').on('click', function trackContextSelect() {
        var whichLink = jQuery(this).text();
        ga('send', 'event', 'Side Menu', 'Selection', whichLink);
    });

//Track how many times somebody uses one of the QuickSearch tabs
    jQuery('.tab-links a').on('click', function trackQuickSearchTabs() {
        var whichTab = jQuery(this).text();
        ga('send', 'event', 'QuickSearch Box', 'Tab', whichTab);
    });

//Track QuickSearch searches and what the search term is.
//Can compare with tabs to see if percentage of limited searches
    jQuery('#search-box-form').on('submit', function trackQuickSearchTerms() {
        var searchTerm = jQuery('#query').val();
        var selectedTab = jQuery('.tab-links a.selected').text();
        ga('send', 'event', 'QuickSearch Box', 'Search', searchTerm);
        ga('send', 'event', 'QuickSearch Box', 'Search w/ tab', selectedTab + ' ; ' + searchTerm);
    });

    jQuery('#searchLibrary').on('change', function trackQuickSearchScope() {
        var changedTo = jQuery('#scope option:selected').text();
        ga('send', 'event', 'QuickSearch Box', 'Scope Change', changedTo);
    });

    /*
    * Event delegation
    * div .randomBoxes on page, a and img loaded via asynchronous AJAX
    * Apply click event to .randomBoxes then delegate it to a or img
    * Yay for keeping things tidy with delegation
    */
    jQuery('.randomBoxes').on('click', 'a', function trackRotatorClicks() {
        var theUrl = jQuery(this).attr('href');
        ga('send', 'event', 'Home Page Rotator', 'Click', theUrl);
    });

//Only apply to databases a-z page, no use mucking things up with event listeners everywhere else
    if (jQuery('#s-lg-az-filters').length) {

        jQuery('#s-lg-az-content').on('click', 'a', function trackAZChosen() {
            var theUrl = jQuery(this).text();
            ga('send', 'event', 'Databases A-Z', 'Chosen', theUrl);
        });

        jQuery('select').on('change', function trackAZFilter() {
            var optionSelected = jQuery(this).find('option:selected').text();
            ga('send', 'event', 'Databases A-Z', 'Filter', optionSelected);
        });
    }
});
