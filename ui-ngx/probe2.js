const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { if(m.type()==='error') console.log('CONSOLE ERR:', m.text().slice(0,300)); });
  page.on('pageerror', e => console.log('PAGE ERROR:', String(e).slice(0,400)));
  page.on('requestfailed', r => console.log('REQ FAIL:', r.url().slice(0,120), r.failure()?.errorText));
  await page.setViewport({width:1440,height:900});
  try { await page.goto('http://localhost:4200', {waitUntil:'networkidle2', timeout:60000}); } catch(e) { console.log('goto err', e.message); }
  await new Promise(r=>setTimeout(r,5000));
  const info = await page.evaluate(()=>{
    const b = document.body.innerText.slice(0,600);
    return {url: location.href, bodyClass: document.body.className, bodyText: b};
  });
  console.log('URL:', info.url);
  console.log('body class:', info.bodyClass);
  console.log('TEXT:', info.bodyText);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
