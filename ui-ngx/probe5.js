const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200', {waitUntil:'domcontentloaded', timeout:60000});
  await sleep(12000);
  const info = await page.evaluate(()=>{
    const bodyChildTags = Array.from(document.body.children).map(c=>c.tagName+'.'+c.className).slice(0,20);
    const fields = Array.from(document.querySelectorAll('input,textarea')).map(i=>({tag:i.tagName, id:i.id, name:i.name, ph:i.placeholder, type:i.type, value:i.value}));
    const txt = document.body.innerText.slice(0,400);
    return {url: location.href, bodyClass: document.body.className, bodyChildTags, fields, txt};
  });
  console.log('INFO:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
