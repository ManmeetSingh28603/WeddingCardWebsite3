import {assets,events,sides,venues,sectionOptions,readInvitation,invitationURL,dateText,timeText,escapeHTML as esc} from './config.js';

const initial=readInvitation(location.search,document.body.dataset.side);
let side=initial.side;
document.querySelector('#builder').innerHTML=`
  <header class="studio-header"><a class="brand" href="index.html"><img src="assets/monogram.svg" alt="Harshit and Pritanshi" width="42" height="42"><span>H & P <small>WEDDING INVITATIONS</small></span></a><a class="header-link" id="general-invite" target="_blank" rel="noopener">Open general invitation <span aria-hidden="true">↗</span></a></header>
  <main class="studio"><div class="studio-controls"><div class="studio-intro"><p class="eyebrow">A PERSONAL INVITATION, BEAUTIFULLY MADE</p><h1>Invitation studio</h1><p>Choose their celebrations. Share a little joy.</p></div>
    <nav class="side-tabs" aria-label="Invitation family"><button data-side="harshit" aria-pressed="false">Harshit’s side <small>Groom</small></button><button data-side="pritanshi" aria-pressed="false">Pritanshi’s side <small>Bride</small></button></nav>
    <form id="invitation-form"><section class="control-section"><div class="section-heading"><h2><span>01</span> The celebrations</h2><div class="selection-actions"><button type="button" id="select-all">Select all</button><span>·</span><button type="button" id="clear-events">Clear</button></div></div><p class="section-help">Which functions is this guest invited to?</p><fieldset class="event-options"><legend class="sr-only">Select wedding functions</legend>${events.map((event,i)=>`<label class="event-option"><input type="checkbox" name="event" value="${event.id}" ${initial.events.some(e=>e.id===event.id)?'checked':''}><span class="custom-check" aria-hidden="true"></span><span class="event-label"><strong>${esc(event.name)}</strong><span>${esc(event.title)}</span><small>${esc(dateText(event.date))} · ${esc(timeText(event.date))}</small></span><span class="event-number" aria-hidden="true">0${i+1}</span></label>`).join('')}</fieldset><p id="selection-summary" class="selection-summary" aria-live="polite"></p></section>
    <section class="control-section"><div class="section-heading"><h2><span>02</span> The little details</h2></div><p class="section-help">Choose the sections to include in their invitation.</p><fieldset class="section-options"><legend class="sr-only">Optional invitation sections</legend>${sectionOptions.map(option=>`<label class="section-option"><span>${esc(option.label)}${option.id==='gallery'&&!assets.gallery.length?'<small>Add photos in the wedding configuration to enable</small>':''}</span><input type="checkbox" name="section" value="${option.id}" ${initial.sections[option.id]?'checked':''} ${option.id==='gallery'&&!assets.gallery.length?'disabled':''}><span class="switch" aria-hidden="true"></span></label>`).join('')}</fieldset></section>
    <section class="control-section share-section"><div class="section-heading"><h2><span>03</span> Send with love</h2></div><label class="link-label" for="guest-link">Your guest’s invitation link</label><div class="link-field"><input id="guest-link" readonly type="url" aria-describedby="link-help"><button id="copy-link" type="button">Copy link</button></div><p id="link-help" class="section-help">Their link includes only the celebrations you selected.</p><div class="share-actions"><a id="whatsapp" class="button-primary" target="_blank" rel="noopener">Share on WhatsApp <span aria-hidden="true">↗</span></a><a id="test-link" class="button-secondary" target="_blank" rel="noopener">Open invitation <span aria-hidden="true">↗</span></a></div><p id="feedback" class="feedback" role="status" aria-live="polite"></p></section></form>
    <details class="studio-notes"><summary>Before sharing with your guests</summary><p>Each link remembers the functions and sections you choose. Create as many guest groups as you need; no accounts or guest lists are stored.</p><p id="hosting-note"></p>${!assets.audio?'<p>Awaiting your supplied audio file. Music will appear once its path is set in <code>src/config.js</code>.</p>':''}${!assets.venuePhoto?'<p>Awaiting your venue photograph. Add it to the assets folder and set its path in <code>src/config.js</code>.</p>':''}<p>The builders are separate from guest invitations. Keep builder links within the family; static hosting does not password-protect these pages.</p></details>
    <footer class="studio-footer">Made for Harshit & Pritanshi <span>December 2026 · Lucknow</span></footer></div>
    <aside class="preview-panel" aria-label="Invitation preview"><div class="preview-heading"><span><i></i> LIVE PREVIEW</span><button id="replay-preview" type="button">Replay opening ↻</button></div><div class="phone-preview"><div class="phone-top" aria-hidden="true"></div><iframe id="invitation-preview" title="Live guest invitation preview"></iframe></div><p class="preview-caption">A little glimpse of what your guests will see.</p><p id="preview-side" class="preview-side"></p></aside></main>`;

const form=document.querySelector('#invitation-form');
const linkInput=document.querySelector('#guest-link');
const preview=document.querySelector('#invitation-preview');
let timer;
preview.addEventListener('load',async()=>{
  const current=preview.contentDocument;
  if(!current)return;
  await Promise.allSettled([current.fonts.ready,...[...current.querySelectorAll('.hero-art')].map(img=>img.decode())]);
  if(preview.contentDocument===current)preview.parentElement.classList.remove('is-loading');
});
function selections(){return [...form.querySelectorAll('[name=event]:checked')].map(e=>e.value);}
function sections(){return Object.fromEntries([...form.querySelectorAll('[name=section]')].map(e=>[e.value,e.checked&&!e.disabled]));}
function update(immediate=false){
  const ids=selections(),empty=ids.length===0,url=invitationURL(location.href,side,ids,sections()),c=sides[side];
  document.title=`${c.first}’s Invitation Studio`;
  document.querySelectorAll('.side-tabs button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.side===side)));
  document.querySelector('#general-invite').href=invitationURL(location.href,side,events.map(e=>e.id));
  linkInput.value=empty?'':url;
  document.querySelector('#copy-link').disabled=empty;
  const test=document.querySelector('#test-link'),whatsapp=document.querySelector('#whatsapp');
  for(const link of [test,whatsapp]){link.setAttribute('aria-disabled',String(empty));link.tabIndex=empty?-1:0;if(empty)link.removeAttribute('href');}
  if(!empty){test.href=url;whatsapp.href=`https://wa.me/?text=${encodeURIComponent(`With love, we invite you to celebrate ${c.first} & ${c.second}’s wedding. Here is your personal invitation:\n\n${url}`)}`;}
  document.querySelector('#selection-summary').textContent=empty?'Choose at least one celebration to create a guest link.':ids.length===1 && ids[0]==='cocktail'?'Cocktail-only invitation · “A Saga of Love”':`${ids.length} of ${events.length} celebrations selected`;
  document.querySelector('#link-help').textContent=empty?'No link will be shared until you select a celebration.':'Their link includes only the celebrations you selected.';
  document.querySelector('#feedback').textContent='';
  document.querySelector('#preview-side').textContent=`${c.first}’s invitation · ${c.family}`;
  const previewURL=new URL(url);previewURL.searchParams.set('preview','1');
  clearTimeout(timer);preview.parentElement.classList.add('is-loading');if(immediate)preview.src=previewURL.href;else timer=setTimeout(()=>{preview.src=previewURL.href;},180);
}
form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('change',()=>update());
document.querySelectorAll('.side-tabs button').forEach(button=>button.addEventListener('click',()=>{side=button.dataset.side;update(true);}));
document.querySelector('#select-all').addEventListener('click',()=>{form.querySelectorAll('[name=event]').forEach(input=>input.checked=true);update();});
document.querySelector('#clear-events').addEventListener('click',()=>{form.querySelectorAll('[name=event]').forEach(input=>input.checked=false);update();});
document.querySelector('#copy-link').addEventListener('click',async()=>{const button=document.querySelector('#copy-link'),feedback=document.querySelector('#feedback');try{await navigator.clipboard.writeText(linkInput.value);button.textContent='Copied ✓';feedback.textContent='Invitation link copied. Ready to share.';setTimeout(()=>button.textContent='Copy link',2200);}catch{linkInput.focus();linkInput.select();feedback.textContent='Copy was blocked by your browser. The link is selected: use Copy or Ctrl+C.';}});
document.querySelector('#replay-preview').addEventListener('click',()=>{clearTimeout(timer);preview.parentElement.classList.add('is-loading');preview.src=invitationURL(location.href,side,selections(),sections());});
document.querySelectorAll('.share-actions a').forEach(link=>link.addEventListener('click',event=>{if(link.getAttribute('aria-disabled')==='true')event.preventDefault();}));
document.querySelector('#hosting-note').textContent=['localhost','127.0.0.1',''].includes(location.hostname)?'You’re using a local preview. Deploy the site first, then open the hosted builder to generate links that guests can access.':'Open invitation to verify the full opening animation before you share. WhatsApp opens a draft; you choose the recipient and send it.';
update(true);
