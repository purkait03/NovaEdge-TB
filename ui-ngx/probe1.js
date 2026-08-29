const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { if(m.type()==='error') console.log('CONSOLE ERR:', m.text().slice(0,200)); });
  page.on('pageerror', e => console.log('PAGE ERROR:', String(e).slice(0,300)));
  await page.setViewport({width:1440,height:900});
  try { await page.goto('http://localhost:4200', {waitUntil:'networkidle2', timeout:60000}); } catch(e) { console.log('goto err', e.message); }
  await new Promise(r=>setTimeout(r,3000));
  const url = page.url();
  const bodyClass = await page.evaluate(()=>document.body.className);
  const title = await page.evaluate(()=>document.title);
  console.log('URL:', url);
  console.log('body class:', bodyClass);
  console.log('title:', title);
  const inputs = await page.evaluate(()=>Array.from(document.querySelectorAll('input')).map(i=>({name:i.name||i.placeholder||i.type, type:i.type, id:i.id})));
  console.log('inputs:', JSON.stringify(inputs));
  const buttons = await page.evaluate(()=>Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim().slice(0,30)).filter(Boolean).slice(0,20));
  console.log('buttons:', JSON.stringify(buttons));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
