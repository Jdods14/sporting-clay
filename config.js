// =============================================================================
//  EVENT CONFIG  —  edit this file to change anything visible on the site.
//  The rest of the code (index.html, script.js) reads from CONFIG below.
// =============================================================================
//
//  ROLLING OVER TO A NEW YEAR
//  --------------------------
//  1. Archive the current year (only do this ONCE, at end of season):
//        - Make a copy of the whole site folder into a /YYYY/ subfolder
//          (e.g. /2026/) following the same pattern as /2025/.
//        - In that copy's config.js, set scoresLabel to 'Final Results'
//          and archiveLink to { url: '../', label: '← Current Event' }.
//
//  2. Update THIS file (the live root config) for the new event:
//        - sheetId       : new Google Sheet ID (see "WHERE TO FIND" below)
//        - eventDate     : new event date string
//        - partnersDir   : e.g. 'images/partners-2027'
//        - partnerLogos  : filenames you've dropped into that folder
//        - archiveLink   : point at the most recent prior year
//        - tabs          : ONLY if the format/sheet tab names change
//
//  3. Test by opening index.html in a browser before publishing.
//
//
//  GOOGLE SHEET REQUIREMENTS
//  -------------------------
//  The sheet must be shared as "Anyone with the link can view".
//  Each tab in the sheet must have these column headers (exact spelling):
//       Name | Team | Player Number | Total | Station 1 | Station 2 | ... | Station 8
//  The tab names in the Google Sheet must match the `sheet` values in
//  the `tabs` array below (case-sensitive, dashes matter).
//
// =============================================================================

const CONFIG = {

  // ---------------------------------------------------------------------------
  //  DATA SOURCE
  // ---------------------------------------------------------------------------

  // The Google Sheet ID. WHERE TO FIND: open the sheet in a browser and copy
  // the long string between "/d/" and "/edit" in the URL. Example URL:
  //   https://docs.google.com/spreadsheets/d/1kFkUUcv...46mo/edit#gid=0
  //                                          ^^^^^^^^^^^^^^^ this part
  sheetId: '1lvADkLUhbSyVha4vAlkkWY6utwbOCTwnMyLiDEKcfR0',


  // ---------------------------------------------------------------------------
  //  HEADER (the band at the top of the page)
  // ---------------------------------------------------------------------------

  eventTitle:    'USS New Jersey',                // big bold line
  eventSubtitle: 'Sporting Clay Invitational',    // smaller line below

  // The line under the title reads:  "<scoresLabel> | <eventDate>"
  // Use 'Live Scores' during the event and 'Final Results' after it ends.
  scoresLabel: 'Live Scores',
  eventDate:   '7 May 2026',

  // Logo image shown on the left of the header. Drop the file in /images/.
  eventLogo: 'images/BATTLESHIP.png',


  // ---------------------------------------------------------------------------
  //  PARTNER LOGOS (the scrolling strip at the bottom of the page)
  // ---------------------------------------------------------------------------

  // Folder that contains all the partner logo files for THIS year's event.
  // Keep each year's logos in its own folder so older archives don't break.
  partnersDir: 'images/partners-2026',

  // Filenames inside `partnersDir` to display, in order. Add or remove lines
  // as partners change. Files can be .png, .jpg, .webp, etc.
  partnerLogos: [
    'logo-1.png',
    'logo-2.png',
    'logo-3.jpg',
    'logo-4.png',
    'logo-5.png',
    'logo-6.png',
    'logo-7.png'
  ],


  // ---------------------------------------------------------------------------
  //  SCORE TABS (the buttons above the leaderboards)
  // ---------------------------------------------------------------------------
  //
  //  Each entry here becomes a button. Fields:
  //    name         : button label shown to users
  //    sheet        : MUST exactly match the tab name in the Google Sheet
  //    stations     : which station columns to display for this tab
  //                     - Regular Season typically uses all 8 stations
  //                     - Playoffs / Championship typically use 5–8 only
  //                     - values must be strings: '1', not 1
  //    default      : (optional) true on the tab that should load first
  //    officialNote : (optional) true to show the "* Not part of official
  //                    scoring" disclaimer above the individuals board
  //
  tabs: [
    { name: 'Regular Season', sheet: 'Regular-Season', stations: ['1','2','3','4','5','6','7','8'], default: true },
    { name: 'Championship',   sheet: 'Playoffs',        stations: ['5','6','7','8'], officialNote: true }
  ],


  // ---------------------------------------------------------------------------
  //  BEHAVIOR
  // ---------------------------------------------------------------------------

  // How often the page re-pulls scores from the sheet, in milliseconds.
  // 30000 = 30 seconds. Lower = fresher but more requests.
  refreshIntervalMs: 30000,

  // Small link near the top that points to last year's archive.
  // Set to null to hide the link entirely.
  // Example: { url: '2025/', label: '2025 Results →' }
  archiveLink: { url: '2025/', label: '2025 Results →' }

};
