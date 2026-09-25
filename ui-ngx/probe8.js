const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e=>console.log('PAGE ERROR:', String(e).slice(0,300)));
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForSelector('#username-input', {timeout:60000});
  await page.type('#username-input', 'tenant@thingsboard.org');
  await page.type('#password-input', 'tenant');
  await page.click('button[type=submit]');
  await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
  await sleep(3000);
  // navigate to customers via client-side router using location
  await page.evaluate(()=>{ history.pushState({},'', '/customers'); location.reload(); });
  // wait for router / customers page
  await sleep(8000);
  const info = await page.evaluate(()=>{
    const url=location.href;
    const mc = document.querySelector('.mat-mdc-card') || document.querySelector('mat-card');
    const table = document.querySelector('table') ;
    return {
      url,
      hasMC: !!mc,
      mcClass: mc?mc.className.slice(0,80):null,
      hasTable: !!table,
      tableClass: table?table.className.slice(0,80):null,
      heading: document.querySelector('h1,h2,h3,.mat-h2,.mat-display-1, .tb-page-title')?.textContent
    };
  });
  console.log('CUSTOMERS:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
