import {assets,venues,readInvitation,eventTitle,dateText,timeText,shortDate,dateRange,mapURL,remaining,escapeHTML as esc} from './config.js';

const state = readInvitation(location.search,document.body.dataset.side);
const {config:c,events:selected,sections} = state;
const preview = new URLSearchParams(location.search).get('preview')==='1' && window.self!==window.top;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const ornament = '<img class="ornament" src="assets/ornament.svg" alt="" width="150" height="27">';
const flowers = (extra='') => `<div class="botanical botanical-left ${extra}" aria-hidden="true"><img src="${assets.floral}" alt="" width="1024" height="1536" loading="lazy"></div><div class="botanical botanical-right ${extra}" aria-hidden="true"><img src="${assets.floral}" alt="" width="1024" height="1536" loading="lazy"></div>`;
const paragraphs = (items,cls='') => items.map(t=>`<p class="${cls}">${esc(t)}</p>`).join('');
const motif = type => {
  const paths = {
    sun:'<circle cx="50" cy="50" r="19"/><path d="M50 12v12m0 52v12M12 50h12m52 0h12M23 23l9 9m36 36 9 9M23 77l9-9m36-36 9-9"/>',
    glasses:'<path d="m18 20 25 5-5 27c-2 14-27 9-25-5zm-5 63 25 5m-10-29-4 26M57 25l25-5 5 27c2 14-23 19-25 5zm5 63 25-5M72 59l4 26M43 9l5 10m9-10-5 10"/>',
    arch:'<path d="M17 84V40Q17 18 50 8q33 10 33 32v44M27 84V42q0-15 23-24 23 9 23 24v42M10 84h80M32 84V50q0-12 18-19 18 7 18 19v34M45 20h10M38 8h24"/>',
    flower:'<path d="M50 50C8 40 12 5 36 18c7 4 14 20 14 32C42 9 77 5 76 30c0 8-14 18-26 20C88 30 102 63 78 68c-8 2-21-9-28-18C81 80 54 100 41 79c-5-7 4-20 9-29C30 86 5 60 24 47c7-4 17-1 26 3Z"/><circle cx="50" cy="50" r="7"/>'
  };
  return `<svg class="event-motif" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2">${paths[type]||paths.flower}</svg>`;
};

function eventScene(group,number) {
  return `<section class="scene event-scene paper ${group.length===1?'single-event':''}" data-scene="events" aria-labelledby="event-heading-${number}">${flowers()}<div class="scene-inner"><p class="eyebrow reveal" data-motion="fade">${esc(dateText(group[0].date))}</p>${group.map((event,index)=>`<article class="event-detail" data-event="${event.id}">${index?'<div class="small-divider reveal" data-motion="fade">&</div>':''}<div class="reveal" data-motion="zoom" style="--duration:3s">${motif(event.motif)}</div><p class="event-type reveal" data-motion="fade" style="--delay:.1s">${event.id==='lunch' && group.some(e=>e.id==='anand-karaj')?'Followed by ':''}${esc(event.name)}</p><h2 ${index===0?`id="event-heading-${number}"`:''} class="script reveal" data-motion="fade" style="--delay:.2s">${esc(eventTitle(event,selected))}</h2><p class="event-time reveal" data-motion="rise" style="--delay:.3s">${esc(timeText(event.date))} onwards</p><div class="venue-inline reveal" data-motion="rise" style="--delay:.4s"><h3>${esc(venues[event.venue].name)}</h3><p>${esc(venues[event.venue].address)}</p><a class="text-link" href="${mapURL(venues[event.venue])}" target="_blank" rel="noopener">Get directions <span aria-hidden="true">↗</span></a></div></article>`).join('')}${ornament}</div></section>`;
}
function schedule() {
  return `<section class="scene schedule paper" id="schedule" aria-labelledby="schedule-title"><h2 id="schedule-title" class="script reveal" data-motion="fade">Schedule of Events</h2>${ornament}<div class="timeline"><div class="timeline-track" aria-hidden="true"></div><div class="timeline-flower" aria-hidden="true">${motif('flower')}</div>${selected.map((event,i)=>`<article class="timeline-row reveal" data-motion="fade" style="--duration:1.5s;--delay:${[0,.1,.1,.3,.4][i]}s" data-summary-event="${event.id}"><div class="timeline-time"><time datetime="${event.date}">${timeText(event.date)}</time><small>${shortDate(event.date)}</small></div><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-description"><h3>${esc(event.name)}</h3><small>${esc(venues[event.venue].name)}</small></div></article>`).join('')}</div></section>`;
}
function venueScene(key) {
  const venue=venues[key];
  if(key==='jb' && assets.venuePhoto) return `<section class="scene supplied-venue venue-scene" data-scene="venue" aria-labelledby="venue-${key}"><div class="petals" aria-hidden="true">${Array.from({length:6},(_,i)=>`<span class="petal petal-${i}"></span>`).join('')}</div><div class="venue-art-panel"><img class="venue-art reveal" data-motion="zoom" style="--duration:3s" src="${esc(assets.venuePhoto)}" alt="JB Innovations, wedding celebration venue" width="1008" height="1792" loading="lazy"><div class="venue-art-caption"><h2 class="script reveal" data-motion="fade">Location</h2>${ornament}<h3 id="venue-${key}" class="reveal" data-motion="rise">${esc(venue.name)}</h3><p class="reveal" data-motion="rise">${esc(venue.address)}</p><a class="directions-button reveal" data-motion="zoom" href="${mapURL(venue)}" target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">↗</span></a></div></div><div class="map-frame reveal" data-motion="zoom"><iframe loading="lazy" title="Map to ${esc(venue.name)}" src="https://maps.google.com/maps?q=${encodeURIComponent(venue.query)}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe></div></section>`;
  return `<section class="scene venue-scene" data-scene="venue" aria-labelledby="venue-${key}"><div class="petals" aria-hidden="true">${Array.from({length:6},(_,i)=>`<span class="petal petal-${i}"></span>`).join('')}</div><div class="venue-flower left reveal" data-motion="right"><img src="${assets.floral}" alt="" loading="lazy"></div><div class="venue-flower right reveal" data-motion="left"><img src="${assets.floral}" alt="" loading="lazy"></div><div class="scene-inner"><h2 class="script reveal" data-motion="fade">Location</h2>${ornament}<h3 id="venue-${key}" class="reveal" data-motion="rise">${esc(venue.name)}</h3><p class="reveal" data-motion="rise">${esc(venue.address)}</p>${key==='jb' && assets.venuePhoto?`<figure class="venue-photo reveal" data-motion="zoom" style="--duration:3s"><img src="${esc(assets.venuePhoto)}" alt="JB Innovations, wedding celebration venue" loading="lazy"></figure>`:`<div class="venue-emblem reveal" data-motion="zoom" style="--duration:3s">${motif('arch')}</div>`}<a class="directions-button reveal" data-motion="zoom" href="${mapURL(venue)}" target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">↗</span></a><div class="map-frame reveal" data-motion="zoom"><iframe loading="lazy" title="Map to ${esc(venue.name)}" src="https://maps.google.com/maps?q=${encodeURIComponent(venue.query)}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>`;
}
function gallery() {
  if (!sections.gallery || !assets.gallery.length) return '';
  return `<section class="scene gallery"><h2 class="script reveal" data-motion="fade">Our Moments</h2>${ornament}<div class="gallery-grid">${assets.gallery.map((photo,i)=>`<button class="gallery-item reveal" data-motion="zoom" data-photo="${i}" aria-label="Open photo ${i+1}"><img src="${esc(photo.src)}" alt="${esc(photo.alt)}" loading="lazy"></button>`).join('')}</div></section><dialog id="photo-dialog"><button class="dialog-close" aria-label="Close photo">×</button><img alt=""></dialog>`;
}

document.title = `${c.first} & ${c.second} · Wedding Invitation`;
if (!selected.length) {
  document.querySelector('#app').innerHTML=`<main class="empty-invitation">${ornament}<h1 class="script">${c.first} & ${c.second}</h1><p>No functions are selected in this invitation.</p><p>Please ask the family for your invitation link.</p>${ornament}</main>`;
} else render();

function render() {
  const groups=[...new Set(selected.map(event=>event.date.slice(0,10)))].map(day=>selected.filter(event=>event.date.startsWith(day)));
  const venueKeys=[...new Set(selected.map(e=>e.venue))];
  const names=`<span>${c.first}</span><span class="ampersand">&</span><span>${c.second}</span>`;
  document.querySelector('#app').innerHTML=`
    <a class="skip-link" href="#invitation">Skip to invitation</a>
    <div class="opening" id="opening"><button id="openInvite" class="envelope-button" aria-label="Open ${c.first} and ${c.second}'s wedding invitation"><span class="envelope-stage"><span class="letter-card"><span class="script">${c.first}<br>&<br>${c.second}</span><span class="letter-date">${dateRange(selected)}</span></span><span class="envelope-piece envelope-base"></span><span class="envelope-piece envelope-left"></span><span class="envelope-piece envelope-right"></span><span class="envelope-piece envelope-bottom"></span><span class="envelope-piece envelope-top"></span><span class="seal"><span>H<span class="seal-amp">&</span>P</span></span><span class="tap-label"><span class="chevron"></span>Tap to open</span></span></button>${assets.openingVideo?`<video class="opening-video" id="opening-video" muted playsinline preload="auto" src="${esc(assets.openingVideo)}"></video>`:''}<button class="skip-opening" id="skip-opening" hidden>Skip opening</button></div>
    <main class="invitation" id="invitation" tabindex="-1" inert>
      <section class="hero" aria-label="${c.first} and ${c.second}'s wedding"><img class="hero-art" src="${assets.garden}" alt="An ivory palace arch overlooking a garden lake with two swans" fetchpriority="high" width="1024" height="1536">${assets.heroVideo?`<video class="hero-video" muted loop playsinline autoplay src="${esc(assets.heroVideo)}" poster="${assets.garden}"></video>`:''}<div class="water-light" aria-hidden="true"></div><div class="hero-content"><p class="hero-heading script hero-enter">Wedding Celebrations</p><p class="hero-date hero-enter">${esc(dateRange(selected))}</p><h1 class="couple-names script hero-enter">${names}</h1><a href="${sections.blessings?'#blessings':'#family'}" class="scroll-cue hero-enter"><span class="script">Scroll down</span><span class="down-chevron"></span></a></div>${flowers('hero-flowers')}</section>
      ${sections.blessings?`<section id="blessings" class="scene blessings paper" aria-labelledby="blessings-title">${flowers()}<div class="scene-inner">${ornament}<p class="eyebrow reveal" data-motion="fade">With the Heavenly Blessings of</p><h2 id="blessings-title" class="script reveal" data-motion="fade">Grandparents</h2><div class="blessing-names reveal" data-motion="fade" style="--duration:2s;--delay:.2s">${paragraphs(c.blessings)}</div>${ornament}</div></section>`:''}
      <section id="family" class="scene family-scene" aria-labelledby="family-title"><div class="scene-inner"><div class="hosts reveal" data-motion="fade" style="--duration:1s">${paragraphs(c.hosts)}</div>${c.together?`<p class="reveal" data-motion="fade">${esc(c.together)}</p>`:''}<p class="request reveal" data-motion="fade" style="--duration:2s;--delay:.2s">${esc(c.request)}</p><h2 id="family-title" class="family-names script reveal" data-motion="rise"><span>${c.first}</span><small>With</small><span>${c.second}</span></h2><div class="relations reveal" data-motion="rise" style="--delay:.2s">${paragraphs(c.relations)}</div>${ornament}</div></section>
      ${sections.countdown?`<section class="scene countdown-scene" aria-labelledby="countdown-title"><h2 id="countdown-title" class="script reveal" data-motion="fade">The Celebration Begins In</h2><div class="countdown reveal" data-motion="countdown" role="timer" aria-label="Time until your first celebration">${['Days','Hours','Minutes','Seconds'].map((label,i)=>`<div><span data-count="${i}">00</span><small>${label}</small></div>`).join('')}</div><p class="countdown-note">${esc(shortDate(selected[0].date))} · ${esc(timeText(selected[0].date))} IST</p></section>`:''}
      ${groups.map(eventScene).join('')}
      ${sections.summary?schedule():''}
      ${sections.venues?venueKeys.map(venueScene).join(''):''}
      ${gallery()}
      <section class="scene closing paper" aria-labelledby="closing-title">${flowers()}<div class="scene-inner"><h2 id="closing-title" class="script reveal" data-motion="fade">With love, always</h2><p class="closing-message reveal" data-motion="fade">${esc(c.closing)}</p><div class="closing-names reveal" data-motion="rise">${paragraphs(c.closingNames)}</div>${assets.venuePhoto && selected.some(event=>event.venue==='jb')?`<img class="closing-photo reveal" data-motion="zoom" src="${esc(assets.venuePhoto)}" alt="Our wedding venue, JB Innovations" loading="lazy">`:''}${ornament}<p class="closing-couple script reveal" data-motion="rise">${c.first} & ${c.second}</p><p class="closing-date">${esc(dateRange(selected))} · Lucknow</p><button class="back-top" id="back-top">Back to the beginning <span aria-hidden="true">↑</span></button></div></section>
    </main>
    <button id="music-toggle" class="music-toggle" aria-label="Play background music" aria-pressed="false" hidden><svg viewBox="0 0 32 32" aria-hidden="true"><path class="play-icon" d="M10 6 26 16 10 26Z"/><path class="pause-icon" d="M8 6h6v20H8zm10 0h6v20h-6z"/></svg></button><div id="audio-message" class="audio-message" role="status"></div>`;
  if(preview)document.body.classList.add('preview-mode');
  setup();
}

function setup() {
  const opening=document.querySelector('#opening');
  const invitation=document.querySelector('#invitation');
  const openButton=document.querySelector('#openInvite');
  const music=document.querySelector('#music-toggle');
  const skip=document.querySelector('#skip-opening');
  const audio=assets.audio?new Audio(assets.audio):null;
  const openingVideo=document.querySelector('#opening-video');
  let started=false,finished=false,finishTimer;
  if(audio){audio.loop=true;audio.preload='none';audio.addEventListener('play',syncAudio);audio.addEventListener('pause',syncAudio);audio.addEventListener('error',()=>audioError());}
  function syncAudio(){music.classList.toggle('is-playing',!audio.paused);music.setAttribute('aria-pressed',String(!audio.paused));music.setAttribute('aria-label',audio.paused?'Play background music':'Pause background music');}
  function audioError(){document.querySelector('#audio-message').textContent='Music couldn’t play. Tap the music button to try again.';setTimeout(()=>{document.querySelector('#audio-message').textContent='';},6000);if(audio)syncAudio();}
  async function playAudio(){try{await audio.play();document.querySelector('#audio-message').textContent='';}catch{audioError();}}
  music.addEventListener('click',()=>{if(audio.paused)playAudio();else audio.pause();});

  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.12});
  const sceneObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    entry.target.classList.toggle('in-view',entry.isIntersecting);
    if(entry.isIntersecting)entry.target.classList.add('has-entered');
  }),{threshold:.08});
  function observe(){document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));document.querySelectorAll('.scene,.hero').forEach(e=>sceneObserver.observe(e));}
  function finish(immediate=false){
    if(finished)return;finished=true;clearTimeout(finishTimer);
    opening.classList.add('is-fading');if(immediate)opening.style.transition='none';
    invitation.inert=false;document.body.classList.remove('is-locked');document.body.classList.add('is-open');
    observe();if(audio && !preview)music.hidden=false;
    setTimeout(()=>{opening.hidden=true;if(openingVideo)openingVideo.pause();if(!preview)invitation.focus({preventScroll:true});},immediate?0:1400);
  }
  function start(){
    if(started)return;started=true;window.scrollTo({top:0,behavior:'instant'});document.body.classList.add('is-opening');openButton.disabled=true;skip.hidden=false;
    // The reference text starts 3s into the opening, then rises 30px over 2s.
    if(audio && !preview)playAudio();
    if(reduced.matches || preview){finish(true);return;}
    if(openingVideo){openingVideo.classList.add('is-playing');openingVideo.play().catch(()=>finish());openingVideo.addEventListener('timeupdate',()=>{if(openingVideo.duration && openingVideo.currentTime>=openingVideo.duration-.8)finish();});openingVideo.addEventListener('ended',()=>finish());openingVideo.addEventListener('error',()=>finish());finishTimer=setTimeout(()=>finish(),12000);}
    else finishTimer=setTimeout(()=>finish(),4000);
  }
  document.body.classList.add('is-locked');
  openButton.addEventListener('click',start);skip.addEventListener('click',()=>finish(true));
  document.querySelector('.skip-link').addEventListener('click',()=>{started=true;document.body.classList.add('is-opening');finish(true);});
  if(preview)start();
  document.querySelector('#back-top').addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  const countdown=document.querySelector('.countdown');
  function tick(){if(!countdown)return;const values=remaining(selected[0].date);values.forEach((value,i)=>document.querySelector(`[data-count="${i}"]`).textContent=String(value).padStart(2,'0'));if(values.every(v=>v===0))document.querySelector('#countdown-title').textContent='The Celebration Is Here';}
  tick();let clock=setInterval(tick,1000);
  document.addEventListener('visibilitychange',()=>{clearInterval(clock);if(!document.hidden){tick();clock=setInterval(tick,1000);}});
  const timeline=document.querySelector('.timeline');let scheduled=false;
  function scrollMotion(){scheduled=false;if(!timeline || reduced.matches)return;const rect=timeline.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.55-rect.top)/rect.height));timeline.style.setProperty('--flower-y',`${progress*Math.max(0,rect.height-48)}px`);}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollMotion);}},{passive:true});addEventListener('resize',scrollMotion);scrollMotion();
  const dialog=document.querySelector('#photo-dialog');
  if(dialog){document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const photo=assets.gallery[Number(button.dataset.photo)];dialog.querySelector('img').src=photo.src;dialog.querySelector('img').alt=photo.alt;dialog.showModal();}));dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});}
}
