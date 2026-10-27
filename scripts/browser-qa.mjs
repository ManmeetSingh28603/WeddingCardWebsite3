async (page) => {
  const checks=[];
  const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message);};
  const base='http://127.0.0.1:8001/';
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const side of ['harshit','pritanshi']){
    for(const width of [360,390,768,1440]){
      await page.setViewportSize({width,height:900});
      await page.goto(`${base}invite.html?side=${side}`,{waitUntil:'domcontentloaded'});
      await page.locator('#openInvite').click();
      await page.locator('#opening').waitFor({state:'hidden'});
      await page.evaluate(()=>document.fonts.ready);
      for(const scene of await page.locator('.scene').all()){
        await scene.evaluate(element=>element.scrollIntoView({block:'start'}));
      }
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${side} has no overflow at ${width}px`);
      check(await page.locator('[data-event]').count()===4,`${side} shows all four event cards at ${width}px`);
      if(width===390){await page.locator('.closing').evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(200);await page.screenshot({path:`output/playwright/${side}-closing.png`});await page.locator('.supplied-venue').evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(250);await page.screenshot({path:`output/playwright/${side}-venue.png`});}
      if(side==='harshit'&&width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/playwright/local-desktop.png'});}
    }
    await page.goto(`${base}invite.html?side=${side}&e=cocktail&hide=blessings,summary`,{waitUntil:'domcontentloaded'});
    await page.locator('#openInvite').click();
    check(await page.locator('[data-event]').count()===1,`${side} cocktail-only has one event`);
    check((await page.locator('[data-event=cocktail] h2').textContent())==='A Saga of Love',`${side} cocktail-only title is preserved`);
    check(await page.locator('[data-event=haldi],#blessings,#schedule').count()===0,`${side} omitted events and sections are absent`);
    check(await page.locator('.venue-scene').count()===1,`${side} cocktail-only excludes Gurudwara location`);
    await page.reload({waitUntil:'domcontentloaded'});
    check(await page.locator('[data-event]').count()===1,`${side} filtering survives refresh`);
  }
  await page.goto(`${base}invite.html?e=not-an-event`,{waitUntil:'domcontentloaded'});
  check(await page.locator('.empty-invitation').count()===1,'Invalid event list shows a safe empty state');
  await page.goto(`${base}bride-invite-builder.html`,{waitUntil:'domcontentloaded'});
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#clear-events').click();
  check(await page.locator('#copy-link').isDisabled(),'Empty selection disables copy');
  check(await page.locator('#whatsapp').getAttribute('href')===null,'Empty selection disables WhatsApp');
  await page.locator('input[name=event][value=cocktail]').check();
  await page.locator('input[name=section][value=blessings]').uncheck();
  const link=await page.locator('#guest-link').inputValue();
  const url=new URL(link);
  check(url.searchParams.get('side')==='pritanshi'&&url.searchParams.get('e')==='cocktail','Bride builder generates correct event-specific link');
  check(url.searchParams.get('hide').includes('blessings'),'Builder serializes optional sections');
  const share=new URL(await page.locator('#whatsapp').getAttribute('href'));
  check(share.searchParams.get('text').includes(link),'WhatsApp draft includes complete encoded guest URL');
  check((await page.locator('#test-link').getAttribute('href'))===link,'Open invitation uses the exact generated URL');
  await page.waitForTimeout(400);
  const frame=page.frameLocator('#invitation-preview');
  await frame.locator('[data-event=cocktail]').waitFor();
  check(await frame.locator('[data-event]').count()===1,'Live preview shows the selected event only');
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await page.locator('#copy-link').click();
  check((await page.evaluate(()=>navigator.clipboard.readText()))===link,'Copy link writes correct URL to clipboard');
  await page.screenshot({path:'output/playwright/builder-desktop.png',fullPage:true});
  await page.locator('.side-tabs [data-side=harshit]').click();
  check(new URL(await page.locator('#guest-link').inputValue()).searchParams.get('side')==='harshit','Family tab changes configuration without losing selections');
  await page.locator('#select-all').click();
  check(await page.locator('[name=event]:checked').count()===4,'Select all restores all four functions');
  await page.setViewportSize({width:360,height:800});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Builder has no overflow at 360px');
  await page.waitForFunction(()=>!document.querySelector('.phone-preview').classList.contains('is-loading'));
  await page.screenshot({path:'output/playwright/builder-mobile.png',fullPage:true});
  await page.route('**/src/config.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace("audio: null","audio: 'output/playwright/qa-tone.wav'")});});
  await page.addInitScript(()=>{const NativeAudio=window.Audio;window.Audio=function(src){const audio=new NativeAudio(src);window.__qaAudio=audio;return audio;};});
  await page.goto(`${base}invite.html?side=harshit`,{waitUntil:'domcontentloaded'});
  await page.locator('#openInvite').click();
  await page.waitForFunction(()=>window.__qaAudio&&!window.__qaAudio.paused);
  check(await page.locator('#music-toggle').getAttribute('aria-pressed')==='true','Real audio fixture starts after opening gesture');
  await page.locator('#music-toggle').click();
  await page.waitForFunction(()=>window.__qaAudio.paused);
  check(await page.locator('#music-toggle').getAttribute('aria-pressed')==='false','Audio pause state updates accessible control');
  await page.locator('#music-toggle').click();
  await page.waitForFunction(()=>!window.__qaAudio.paused);
  await page.locator('.closing').evaluate(e=>e.scrollIntoView({block:'start'}));
  check(await page.evaluate(()=>!window.__qaAudio.paused&&window.__qaAudio.loop),'Audio continues and loops through section scrolling');
  await page.unroute('**/src/config.js');
  check(errors.length===0,`No application JavaScript errors (${errors.join('; ')})`);
  await page.emulateMedia({reducedMotion:'no-preference'});
  return {passed:checks.length,checks};
}
