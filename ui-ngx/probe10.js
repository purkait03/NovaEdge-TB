const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForSelector('#username-input', {timeout:60000});
  await page.type('#username-input', 'tenant@thingsboard.org');
  await page.type('#password-input', 'tenant');
  await page.click('button[type=submit]');
  await page.waitForFunction(()=>!location.href.includes('/login'), {timeout:60000});
  await sleep(3000);
  await page.evaluate(()=>{ history.pushState({},'', '/customers'); location.reload(); });
  await sleep(10000);
  const info = await page.evaluate(()=>{
    const tables = Array.from(document.querySelectorAll('table')).map(t=>({cls:t.className, rows:t.querySelectorAll('.mat-mdc-row').length, cells:t.querySelectorAll('.mat-mdc-cell').length}));
    return {
      url:location.href,
      tables,
      bodyText: document.body.innerText.replace(/\s+/g,' ').trim().slice(0,500),
      rootChildren: Array.from(document.querySelector('tb-root')?.children||[]).map(c=>c.tagName+'.'+(c.className||'').toString().slice(0,40)).slice(0,15)
    };
  });
  console.log('INFO:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
