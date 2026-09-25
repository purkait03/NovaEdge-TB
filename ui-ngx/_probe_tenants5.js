const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/login', {waitUntil:'networkidle2', timeout:60000});
  await sleep(2000);
  await page.type('#username-input', 'sysadmin@thingsboard.org');
  await page.type('#password-input', 'sysadmin');
  await page.click('button[type=submit]');
  await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
  await sleep(4000);
  await page.goto('http://localhost:4200/tenants', {waitUntil:'networkidle2', timeout:60000});
  await sleep(8000);
  const getHeights = async (label) => {
    return await page.evaluate((lbl)=>{
      const host = document.querySelector('tb-entities-table');
      const main = document.querySelector('.tb-main-content');
      const sidenavContent = document.querySelector('mat-sidenav-content');
      const drawerContainer = host ? host.querySelector('mat-drawer-container') : null;
      const entityTable = document.querySelector('.tb-entity-table');
      const results = {};
      const check = (el, name) => {
        if(!el) { results[name]='no-el'; return; }
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        results[name] = { display: cs.display, height: cs.height, flex: cs.flex, position: cs.position, overflow: cs.overflow, rectHeight: rect.height, rectTop: rect.top };
      };
      check(host, 'host');
      check(drawerContainer, 'drawerContainer');
      check(entityTable, 'entityTable');
      check(main, 'mainContent');
      check(sidenavContent, 'sidenavContent');
      check(document.querySelector('.tb-entity-table-content'), 'tableContent');
      check(document.querySelector('table.mat-mdc-table'), 'table');
      // also check body background
      results.bodyClass = document.body.className;
      results.bodyBg = getComputedStyle(document.body).backgroundColor;
      results.label = lbl;
      return results;
    }, label);
  };
  console.log('LIGHT', JSON.stringify(await getHeights('light'), null, 2));
  // toggle dark
  await page.evaluate(()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    const b = buttons.find(x=> x.innerHTML.includes('dark_mode') || x.innerHTML.includes('light_mode'));
    if(b) b.click();
  });
  await sleep(3000);
  console.log('DARK', JSON.stringify(await getHeights('dark'), null, 2));
  // check if anything has display:none or height 0 via our dark css
  const styles = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    return {
      hostInline: host ? host.getAttribute('style') : null,
      computedHostBg: host? getComputedStyle(host).backgroundColor : null,
      bodyInner: document.body.innerHTML.slice(0,1000)
    };
  });
  console.log('styles', JSON.stringify(styles, null, 2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
