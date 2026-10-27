async (page) => {
  const checks=[], failures=[];
  const check=(ok,message)=>{if(!ok)throw new Error(message);checks.push(message);};
  page.on('response',response=>{if(response.url().startsWith('http://127.0.0.1:8000/')&&response.status()>=400)failures.push(response.url());});
  const base='http://127.0.0.1:8000/dist/';
  await page.setViewportSize({width:360,height:800});
  await page.goto(base+'groom-invite-builder.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.querySelector('.phone-preview').classList.contains('is-loading'));
  check(await page.frameLocator('#invitation-preview').locator('.hero-art').evaluate(image=>image.complete&&image.naturalWidth>0),'Preview waits for artwork and fonts');
  await page.screenshot({path:'output/playwright/builder-mobile-final.png',fullPage:true});
  await page.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('Clipboard blocked for QA'));});
  await page.locator('#copy-link').click();
  check((await page.locator('#feedback').textContent()).includes('Copy was blocked'),'Clipboard failure offers manual copying');
  const href=await page.locator('#test-link').getAttribute('href');
  check(href.startsWith(base+'invite.html'),'Production builder preserves deployment subpath');
  const popupPromise=page.waitForEvent('popup');await page.locator('#test-link').click();const popup=await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  check(await popup.locator('#openInvite').count()===1,'Open invitation opens the actual guest link in a new tab');
  await popup.close();
  await page.locator('#replay-preview').click();
  await page.frameLocator('#invitation-preview').locator('#openInvite').waitFor();
  check(await page.frameLocator('#invitation-preview').locator('#openInvite').isVisible(),'Replay opening restores the envelope');
  await page.goto(base+'invite.html?side=pritanshi&e=anand-karaj',{waitUntil:'domcontentloaded'});
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#openInvite').click();
  check(await page.locator('.closing-photo,.supplied-venue').count()===0,'Anand Karaj-only link excludes the other venue photo');
  check(await page.locator('[data-event]').count()===1,'Production invite honors event filtering');
  await page.goto(base+'invite.html?side=harshit',{waitUntil:'domcontentloaded'});
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(1500);await page.screenshot({path:'output/playwright/local-envelope-final.png'});
  await page.locator('#openInvite').click();await page.waitForTimeout(5600);
  check(await page.locator('#opening').isHidden(),'Normal opening finishes without blocking guests');
  check(await page.locator('.hero-enter').first().evaluate(e=>getComputedStyle(e).animationDuration)==='2s','Hero entrance retains measured 2-second duration');
  check(await page.locator('.hero-enter').first().evaluate(e=>getComputedStyle(e).animationDelay)==='3s','Hero entrance retains measured 3-second delay');
  await page.screenshot({path:'output/playwright/local-hero-final.png'});
  for(const [selector,name] of [['.countdown-scene','countdown'],['.event-scene','events'],['.supplied-venue','venue']]){
    await page.locator(selector).first().evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(3200);await page.screenshot({path:`output/playwright/local-${name}-final.png`});
  }
  await page.locator('.closing').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(2200);
  check(await page.locator('.closing-photo').evaluate(img=>img.complete&&img.naturalWidth>0),'Supplied closing photo loads from production build');
  check(failures.length===0,`No failed local asset requests (${failures.join(',')})`);
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'builder.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.querySelector('.phone-preview').classList.contains('is-loading'));
  await page.screenshot({path:'output/playwright/builder-desktop-final.png'});
  return {passed:checks.length,checks};
}
