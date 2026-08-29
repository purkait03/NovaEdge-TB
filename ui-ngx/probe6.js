const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/', {waitUntil:'domcontentloaded', timeout:60000});
  let url='';
  for(let i=0;i<20;i++){
    await sleep(3000);
    url = page.url();
    const fcount = await page.evaluate(()=>document.querySelectorAll('input').length);
    console.log('tick',i,'url',url,'inputs',fcount);
    if(fcount>0) break;
  }
  const info = await page.evaluate(()=>{
    const fields = Array.from(document.querySelectorAll('input,button')).map(i=>({tag:i.tagName, id:i.id, name:i.name, ph:i.placeholder, type:i.type, txt:(i.tagName==='BUTTON'?i.textContent.trim().slice(0,20):'')})).filter(x=>x.tagName!=='BUTTON'||x.txt);
    return {url: location.href, bodyClass: document.body.className, fields};
  });
  console.log('FINAL:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
