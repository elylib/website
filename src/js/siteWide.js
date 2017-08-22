// //Only apply to ILL pages
// if ( $('.illButton').length ) {
//     /*
//     * Applies to the Circulation and home guide ILL pages
//     * The article and book ILL links have IDs that have the number portion
//     * of wrapper-box IDs seperated by '-'
//     * On click, get that number, hide all the boxes, then just show the article or book form
//     * Selectors in both ILL functions are brittle/specific as hell, but what's a person to do?
//     */
//     $( '.illButton' ).on( 'click', function showILLForm( e ) {
//         e.preventDefault();

//         var boxes =  $( this ).attr( 'id' ).split( '-' );

//         $( '#s-lg-col-2>div>div' ).hide();
//         for ( var id in boxes ) {
//             $( '#s-lg-box-wrapper-' + boxes[id] ).show().prepend( '<a href="#" class="returnToILL">Return to ILL</a>' );
//         }
//     });

//     /*
//     * Applies to the Circulation and home guide ILL pages
//     * Show page as default again.
//     * nth-child notation selects range, in this case only from 1st child through 2nd
//     * These selectors are outta control
//     */
//     $( '#s-lg-col-2>div' ).on( 'click', '.returnToILL', function hideILLForm( e ) {
//         e.preventDefault();

//         $( '#s-lg-col-2>div>div' ).hide();
//         $( '#s-lg-col-2>div>div:nth-child(n+1):nth-child(-n+2)' ).show();
//         $( '.returnToILL' ).remove();
//     });
// }

//Print and Microform guide
if ( $( '.pam-notElectronic' ).length ) {
    //Wrap in IIFE to contain scope
    (function() {

        var oclcNum = ( document.URL.match( /ocn=\d+/ ) || [false] )[0];

        if ( oclcNum ) {

            $( '.pam-navigatedHere' ).hide();

            $.ajax({
                url: 'http://legacy.lib.westfield.ma.edu/oclc_records/getRecord.php?'+oclcNum,
                dataType: 'jsonp',
                beforeSend: function() {
                    $( '.pam-eJournalLoadSpin' ).show();
                },
                success: function notEHoldingsPage( data ) {

                    $('.pam-notElectronic').show();

                    if ( data.title ) {

                        $( '.pam-title' ).html( '<strong>Title</strong>: ' + data.title );
                        $( '.pam-holdings' ).html( '<strong>Availability</strong>: ' + data.holdings );

                    } else if ( data.statusCode ) {
                        ga( 'send', 'event', 'Print Holdings Page', 'PHP Error', data.statusCode + ' ' + data.wwwAuthenticate + ': ' + data.responseBody );
                    } else {
                        ga( 'send', 'event', 'Print Holdings Page', 'Record Error', oclcNum + ': ' + data );
                    }
                },
                error: function( thingy, error, message ) {
                    ga( 'send', 'event', 'Print Holdings Page', 'AJAX Error', error + ': ' + message );
                },
                complete: function() {
                    $( '.pam-eJournalLoadSpin' ).remove();
                }
            });
        } else {
            ga( 'send', 'event', 'Print Holdings Page', 'No OCLC Number', document.referrer );
        }
    })();
}
