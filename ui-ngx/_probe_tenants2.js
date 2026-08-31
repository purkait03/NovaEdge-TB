const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => console.log('CONSOLE', m.text().slice(0,500)));
  page.on('pageerror', e => console.log('PAGEERROR', String(e).slice(0,600)));
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/', {waitUntil:'domcontentloaded', timeout:60000});
  await sleep(5000);
  let url = page.url();
  console.log('initial url', url);
  // need login?
  const hasLogin = await page.evaluate(()=> !!document.querySelector('#username-input'));
  console.log('hasLogin', hasLogin);
  if (hasLogin) {
    await page.waitForSelector('#username-input', {timeout:10000});
    await page.type('#username-input', 'sysadmin@thingsboard.org');
    await page.type('#password-input', 'sysadmin');
    await page.click('button[type=submit]');
    await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
    await sleep(3000);
    console.log('after login url', page.url());
  } else {
    // check if already authenticated via has tb-root content
    const info = await page.evaluate(()=> document.body.innerText.slice(0,2000));
    console.log('body snippet', info.slice(0,500));
  }
  await page.goto('http://localhost:4200/tenants', {waitUntil:'networkidle2', timeout:60000});
  await sleep(7000);
  const light = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    const table = document.querySelector('table.mat-mdc-table');
    const rows = document.querySelectorAll('mat-row, .mat-mdc-row');
    const paginator = document.querySelector('mat-paginator');
    const addBtn = Array.from(document.querySelectorAll('button')).find(b=> /add tenant/i.test(b.textContent));
    const text = document.body.innerText.slice(0,1500);
    const rect = host ? host.getBoundingClientRect() : null;
    const style = host ? getComputedStyle(host) : null;
    return {
      url: location.href,
      bodyClass: document.body.className,
      hasHost: !!host,
      hostDisplay: style? style.display : 'no',
      hostHeight: rect? rect.height : 0,
      hasTable: !!table,
      rowCount: rows.length,
      hasPaginator: !!paginator,
      hasAddBtn: !!addBtn,
      textSnippet: text.slice(0,800),
      htmlLen: host? host.innerHTML.length : 0
    };
  });
  console.log('LIGHT', JSON.stringify(light, null, 2));
  // switch to dark
  await page.evaluate(()=>{
    localStorage.setItem('tb-dark-mode','true');
    document.body.classList.remove('tb-default');
    document.body.classList.add('tb-dark');
    const o=document.querySelector('.cdk-overlay-container');
    if(o){ o.classList.remove('tb-default'); o.classList.add('tb-dark'); }
  });
  await sleep(2000);
  const dark = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    const table = document.querySelector('table.mat-mdc-table');
    const rows = document.querySelectorAll('mat-row, .mat-mdc-row');
    const container = document.querySelector('.tb-entity-table-content');
    const styleHost = host? getComputedStyle(host) : null;
    const styleTable = table? getComputedStyle(table) : null;
    const styleContainer = container? getComputedStyle(container) : null;
    const firstRow = document.querySelector('mat-row, .mat-mdc-row');
    const styleRow = firstRow? getComputedStyle(firstRow) : null;
    const rect = host? host.getBoundingClientRect() : null;
    return {
      bodyClass: document.body.className,
      hasHost: !!host,
      hostDisplay: styleHost? styleHost.display : 'no',
      hostHeight: rect? rect.height : 0,
      hostVisibility: styleHost? styleHost.visibility : 'no',
      hostOpacity: styleHost? styleHost.opacity : 'no',
      hasTable: !!table,
      rowCount: rows.length,
      tableDisplay: styleTable? styleTable.display : 'no',
      tableBg: styleTable? styleTable.backgroundColor : 'no',
      tableColor: styleTable? styleTable.color : 'no',
      containerBg: styleContainer? styleContainer.backgroundColor : 'no',
      rowColor: styleRow? styleRow.color : 'no',
      rowBg: styleRow? styleRow.backgroundColor : 'no',
      textSnippet: document.body.innerText.slice(0,1200)
    };
  });
  console.log('DARK', JSON.stringify(dark, null, 2));
  // switch back to light to confirm not destroyed
  await page.evaluate(()=>{
    localStorage.setItem('tb-dark-mode','false');
    document.body.classList.remove('tb-dark');
    document.body.classList.add('tb-default');
    const o=document.querySelector('.cdk-overlay-container');
    if(o){ o.classList.remove('tb-dark'); o.classList.add('tb-default'); }
  });
  await sleep(1500);
  const light2 = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    return { hasHost: !!host, rows: document.querySelectorAll('mat-row, .mat-mdc-row').length, bodyClass: document.body.className };
  });
  console.log('LIGHT2', JSON.stringify(light2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
