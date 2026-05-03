// Frozen archive of the 2025 event. Do not edit unless correcting an archival error.

const CONFIG = {
  sheetId: '1kFkUUcvSt2LyOJKSweQLwmZ_ZIa5qTJoNKvDLQB46mo',

  eventTitle: 'USS New Jersey',
  eventSubtitle: 'Sporting Clay Invitational',
  scoresLabel: 'Final Results',
  eventDate: '26 June 2025',
  eventLogo: 'images/BATTLESHIP.png',

  partnersDir: 'images/partners',
  partnerLogos: [
    'logo-1.png', 'logo-2.webp', 'logo-3.png', 'logo-4a.png', 'logo-5.png',
    'logo-6.png', 'logo-7.png', 'logo-8.png', 'logo-9.png', 'logo-10.png',
    'logo-11.png', 'logo-12.png', 'logo-13.png', 'logo-14.png'
  ],

  tabs: [
    { name: 'Regular Season', sheet: 'Regular-Season', stations: ['1','2','3','4','5','6','7','8'], default: true },
    { name: 'Playoffs',       sheet: 'Playoffs',       stations: ['5','6','7','8'], officialNote: true },
    { name: 'Championship',   sheet: 'Championship',   stations: ['5','6','7','8'], officialNote: true }
  ],

  refreshIntervalMs: 30000,

  archiveLink: { url: '../', label: '← Current Event' }
};
