const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => console.log('CONSOLE', m.text().slice(0,800)));
  page.on('pageerror', e => console.log('PAGEERROR', String(e).slice(0,800)));
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/login', {waitUntil:'networkidle2', timeout:60000});
  await sleep(3000);
  console.log('login url', page.url());
  const hasLogin = await page.evaluate(()=> !!document.querySelector('#username-input'));
  console.log('hasLogin', hasLogin);
  if (hasLogin) {
    await page.type('#username-input', 'sysadmin@thingsboard.org');
    await page.type('#password-input', 'sysadmin');
    await page.click('button[type=submit]');
    await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
    await sleep(5000);
    console.log('after login url', page.url());
    console.log('after login body', (await page.evaluate(()=>document.body.innerText.slice(0,1000))).slice(0,500));
  }
  await page.goto('http://localhost:4200/tenants', {waitUntil:'networkidle2', timeout:60000});
  await sleep(8000);
  const light = await page.evaluate(()=>{
    const host = document.querySelector('tb-entities-table');
    const table = document.querySelector('table.mat-mdc-table');
    const rows = document.querySelectorAll('mat-row, .mat-mdc-row');
    return {
      hasHost: !!host,
      hasTable: !!table,
      rowCount: rows.length,
      bodyClass: document.body.className,
      text: document.body.innerText.slice(0,2000),
      html: host ? host.outerHTML.slice(0,4000) : document.body.innerHTML.slice(0,4000)
    };
  });
  console.log('LIGHT TENANTS', JSON.stringify(light, null, 2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
