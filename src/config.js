// All wedding content and client assets live here. All dates include India's UTC offset.
export const assets = {
  garden: 'assets/garden.webp',
  envelope: 'assets/envelope.webp',
  floral: 'assets/floral.webp',
  audio: null, // e.g. 'assets/wedding-song.mp3' — use the client's exact supplied recording.
  openingVideo: null, // Optional authorized opening film; original CSS sequence is the default.
  heroVideo: null, // Optional authorized moving garden footage.
  venuePhoto: 'assets/venue.jpg', // Client-supplied venue artwork; preserved without retouching.
  gallery: [] // [{src:'assets/couple-01.jpg', alt:'Harshit and Pritanshi ...'}]
};

export const venues = {
  jb: {
    name: 'JB Innovations',
    address: 'Amar Shaheed Path, near Kapoor Tata Motor, Aurangabad, Omaxe City, Lucknow.',
    query: 'JB Innovations, Amar Shaheed Path, near Kapoor Tata Motor, Aurangabad, Omaxe City, Lucknow'
  },
  gurudwara: {
    name: 'Ashiyana Gurudwara',
    address: 'Sector M, Ashiyana, Lucknow.',
    query: 'Ashiyana Gurudwara, Sector M, Ashiyana, Lucknow'
  }
};

export const events = [
  { id: 'haldi', name: 'Haldi', title: 'Hues of Love', date: '2026-12-03T12:30:00+05:30', venue: 'jb', motif: 'sun' },
  { id: 'cocktail', name: 'Cocktail', title: 'The Saga of Love', soloTitle: 'A Saga of Love', date: '2026-12-03T20:00:00+05:30', venue: 'jb', motif: 'glasses' },
  { id: 'anand-karaj', name: 'Anand Karaj', title: 'The Blissful Union', date: '2026-12-04T12:30:00+05:30', venue: 'gurudwara', motif: 'arch' },
  { id: 'lunch', name: 'Jaimal and Lunch', title: 'Together in Celebration', date: '2026-12-04T14:30:00+05:30', venue: 'jb', motif: 'flower' }
];

export const sides = {
  harshit: {
    label: 'Groom', first: 'Harshit', second: 'Pritanshi', family: 'Raisinghani & Manwani Family',
    blessings: ['Late Smt. Bharti & Late Shri Harkishan Singh Raisinghani', 'Late Smt. Parvati & Late Shri Nanak Ram Manwani'],
    hosts: ['Smt. Tanisha & Shri Darshan Raisinghani'],
    together: 'Together with their family',
    request: 'Request the pleasure of your gracious presence at the wedding celebrations of their beloved son',
    relations: ['Grandson of Late Smt. Sangeeta & Late Shri Ram Chand Jeswani', 'Son of Smt. Meghna & Shri Sanjay Jeswani'],
    closing: 'Awaiting your Presence,',
    closingNames: ['Hunar & Sumit Dembra,', 'Harshita & Karamjeet Raisinghani,', 'Soni and Late Ashwani Samtani,', 'Raisinghani and Manwani Family']
  },
  pritanshi: {
    label: 'Bride', first: 'Pritanshi', second: 'Harshit', family: 'Jeswani Family',
    blessings: ['Late Smt. Sangeeta & Late Shri Ram Chand Jeswani'],
    hosts: ['Smt. Meghna & Shri Sanjay Jeswani along with', 'Smt. Rhythm & Shri Yogansh Jeswani'],
    together: '',
    request: 'Request the pleasure of your gracious presence at the wedding celebrations of their beloved',
    relations: ['Grandson of Late Smt. Bharti & Late Shri Harkishan Singh Raisinghani', 'Son of Smt. Tanisha & Shri Darshan Raisinghani'],
    closing: 'Request the honour of your presence & awaiting your company',
    closingNames: ['Smt. Ratna W/o Late Shri Moti Ram Jeswani', 'Smt. Harsha W/o Late Shri Laxman Das Jeswani', 'Smt. Anju & Shri Suresh Tejwani', 'Smt. Neeta & Shri Lalit Nandwani', 'Smt. Sunita & Shri Ram Khilwani', 'Smt. Babita & Shri Chandan Sukhwani', 'Rudransh Jeswani']
  }
};

export const sectionOptions = [
  {id:'blessings', label:"Grandparents’ blessings", default:true},
  {id:'countdown', label:'Celebration countdown', default:true},
  {id:'summary', label:'Schedule of events', default:true},
  {id:'venues', label:'Venues & directions', default:true},
  {id:'gallery', label:'Photo gallery', default:true}
];

export function readInvitation(search = '', fixedSide = '') {
  const params = new URLSearchParams(search);
  const requestedSide = fixedSide || params.get('side') || 'harshit';
  const side = Object.hasOwn(sides, requestedSide) ? requestedSide : 'harshit';
  const raw = params.has('e') ? params.get('e').split(',').filter(Boolean) : events.map(e=>e.id);
  const selected = events.filter(e=>raw.includes(e.id));
  const hidden = new Set((params.get('hide') || '').split(','));
  const sections = Object.fromEntries(sectionOptions.map(s=>[s.id, !hidden.has(s.id)]));
  return {side, config:sides[side], events:selected, sections, invalid:raw.some(id=>!events.some(e=>e.id===id))};
}

export function invitationURL(base, side, ids, sections = {}) {
  const url = new URL('invite.html', base);
  url.searchParams.set('side', Object.hasOwn(sides,side) ? side : 'harshit');
  const selected = events.filter(e=>ids.includes(e.id));
  if (selected.length !== events.length) url.searchParams.set('e', selected.map(e=>e.id).join(','));
  const hidden = sectionOptions.filter(s=>sections[s.id]===false).map(s=>s.id);
  if (hidden.length) url.searchParams.set('hide',hidden.join(','));
  return url.href;
}

export function eventTitle(event, selected) {
  return event.id==='cocktail' && selected.length===1 ? event.soloTitle : event.title;
}
const india = {timeZone:'Asia/Kolkata'};
export const dateText = date => new Intl.DateTimeFormat('en-GB',{...india,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(date));
export const shortDate = date => new Intl.DateTimeFormat('en-GB',{...india,day:'numeric',month:'short'}).format(new Date(date));
export const timeText = date => new Intl.DateTimeFormat('en-US',{...india,hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(date));
export function dateRange(selected) {
  if (!selected.length) return '';
  const days = [...new Set(selected.map(e=>e.date.slice(0,10)))];
  const format = value => new Intl.DateTimeFormat('en-GB',{...india,day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00+05:30'));
  if(days.length===1)return format(days[0]);
  if(days.every(day=>day.slice(0,7)===days[0].slice(0,7))){
    const monthYear=new Intl.DateTimeFormat('en-GB',{...india,month:'long',year:'numeric'}).format(new Date(selected[0].date));
    return `${days.map(day=>Number(day.slice(-2))).join(' & ')} ${monthYear}`;
  }
  return days.map(format).join(' & ');
}
export const mapURL = venue => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.query)}`;
export function remaining(date, now=Date.now()) {
  const total = Math.max(0,Math.floor((new Date(date).getTime()-now)/1000));
  return [Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];
}
export const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
