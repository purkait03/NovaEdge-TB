const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { if(m.text().includes('light-mode')||m.text().includes('dark')) console.log('CONSOLE', m.text().slice(0,300)); });
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/login', {waitUntil:'networkidle2', timeout:60000});
  await sleep(2000);
  await page.type('#username-input', 'sysadmin@thingsboard.org');
  await page.type('#password-input', 'sysadmin');
  await page.click('button[type=submit]');
  await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
  await sleep(4000);
  await page.goto('http://localhost:4200/tenants', {waitUntil:'networkidle2', timeout:60000});
  await sleep(7000);
  const light = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    const table = document.querySelector('table.mat-mdc-table');
    const container = document.querySelector('.tb-entity-table-content');
    return {
      hasHost: !!host,
      hasTable: !!table,
      rowCount: document.querySelectorAll('mat-row, .mat-mdc-row').length,
      bodyClass: document.body.className,
      containerBg: container? getComputedStyle(container).backgroundColor : 'no',
      hostHeight: host? host.getBoundingClientRect().height : 0,
      text: document.body.innerText.slice(0,1000)
    };
  });
  console.log('LIGHT', JSON.stringify(light, null, 2));
  // click dark toggle button
  const btn = await page.evaluate(()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    const b = buttons.find(x=> x.innerHTML.includes('dark_mode') || x.innerHTML.includes('light_mode'));
    return b ? b.outerHTML.slice(0,500) : 'notfound'+buttons.map(b=>b.innerHTML.slice(0,40)).join('|').slice(0,500);
  });
  console.log('btn', btn);
  // Find and click the dark toggle
  await page.evaluate(()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    const b = buttons.find(x=> x.innerHTML.includes('dark_mode') || x.innerHTML.includes('light_mode'));
    if(b) b.click();
  });
  await sleep(3000);
  const dark = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    const table = document.querySelector('table.mat-mdc-table');
    const container = document.querySelector('.tb-entity-table-content');
    const rows = document.querySelectorAll('mat-row, .mat-mdc-row');
    const firstRow = rows[0];
    return {
      bodyClass: document.body.className,
      overlayClass: document.querySelector('.cdk-overlay-container')?.className,
      hasHost: !!host,
      hasTable: !!table,
      rowCount: rows.length,
      containerBg: container? getComputedStyle(container).backgroundColor : 'no',
      containerDisplay: container? getComputedStyle(container).display : 'no',
      containerHeight: container? container.getBoundingClientRect().height : 0,
      hostHeight: host? host.getBoundingClientRect().height : 0,
      tableBg: table? getComputedStyle(table).backgroundColor : 'no',
      rowBg: firstRow? getComputedStyle(firstRow).backgroundColor : 'no',
      rowColor: firstRow? getComputedStyle(firstRow).color : 'no',
      text: document.body.innerText.slice(0,1500),
      stillHasAdd: !!Array.from(document.querySelectorAll('button')).find(b=>/add tenant/i.test(b.textContent))
    };
  });
  console.log('DARK', JSON.stringify(dark, null, 2));
  // toggle back
  await page.evaluate(()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    const b = buttons.find(x=> x.innerHTML.includes('dark_mode') || x.innerHTML.includes('light_mode'));
    if(b) b.click();
  });
  await sleep(2000);
  const light2 = await page.evaluate(()=>({ bodyClass: document.body.className, hasHost: !!document.querySelector('tb-entities-table'), rows: document.querySelectorAll('mat-row, .mat-mdc-row').length }));
  console.log('LIGHT2', JSON.stringify(light2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
