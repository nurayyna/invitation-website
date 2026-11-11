// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for wedding details.
// Presentation components read from here; nothing in this file knows about
// layout or animation.
//
// PLACEHOLDERS: any value left as `null` renders as an elegant "to come"
// placeholder on the site. Replace `null` with your text, or with a photo path
// such as '/photos/how-we-met.jpg' (files live in /public/photos).
// ─────────────────────────────────────────────────────────────────────────────

export const wedding = {
  couple: {
    first: 'Amelia',
    second: 'Andy',
    monogram: ['A', 'A'],
  },

  dateISO: '2027-07-02T13:00:00',
  dateLong: 'Friday, 2 July 2027',
  time: '1:00 PM onwards',
  hostLine: 'Together with their families',

  invitation: {
    request: [
      'request the pleasure of your company',
      'at the celebration of their wedding reception',
    ],
    closing: [
      'Your presence and blessings mean the world to us.',
      'We look forward to celebrating this joyful day with you.',
    ],
  },

  // Our Story — three chapters. Fill in title, text, photo and caption.
  story: {
    intro: null,
    chapters: [
      { title: null, text: null, photo: null, caption: null },
      { title: null, text: null, photo: null, caption: null },
      { title: null, text: null, photo: null, caption: null },
    ],
  },

  // Order of the day. Add rows as they are confirmed:
  //   { time: '3:00 PM', title: 'Cake Cutting', detail: 'The garden terrace' }
  schedule: [
    { time: '1:00 PM', title: 'Wedding Reception', detail: 'Rumah Dusun' },
  ],

  venue: {
    name: 'Rumah Dusun',
    address: null,   // e.g. 'Jalan …, 43000 Kajang, Selangor'
    mapsUrl: null,   // e.g. 'https://maps.app.goo.gl/…' — enables the Directions button
    photo: null,     // e.g. '/photos/venue.jpg'
  },

  dressCode: {
    summary: 'Smart casual — in greens, creams, or earth tones.',
    avoid: 'Please avoid wearing white or black.',
    // Illustrative swatches for the palette above — adjust freely.
    palette: [
      { name: 'Forest', hex: '#1C3524' },
      { name: 'Sage',   hex: '#A5AC8C' },
      { name: 'Cream',  hex: '#EFE6D2' },
      { name: 'Sand',   hex: '#C9B38C' },
      { name: 'Umber',  hex: '#7B5B3E' },
    ],
  },

  rsvp: {
    intro: 'We would love to know if you can make it.',
    deadline: '15 June 2027',
    note: 'Seats are limited · Early response appreciated',
    maxGuests: 4,    // largest party size offered in the form
  },

  closing: {
    message: 'Until we meet in the garden.',   // edit to your own words
  },

  // Credits for the public-domain artwork used on the site.
  artwork: [
    'John Constable, Wivenhoe Park, Essex, 1816. National Gallery of Art, Washington. Public domain.',
    'Pierre-Joseph Redouté, Rosa centifolia foliacea, from Les Roses, 1817–24. Public domain.',
  ],
}
