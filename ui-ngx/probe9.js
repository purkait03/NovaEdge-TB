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
  await sleep(8000);
  const info = await page.evaluate(()=>{
    const table = document.querySelector('table.mat-mdc-table');
    let chain=[];
    if(table){
      let el=table;
      for(let i=0;i<6 && el;i++){
        const cs=getComputedStyle(el);
        chain.push({tag:el.tagName, cls:(el.className&&String(el.className).slice(0,90))||'', bg:cs.backgroundColor, display:cs.display, opacity:cs.opacity, position:cs.position, z:cs.zIndex, vis:cs.visibility});
        el=el.parentElement;
      }
    }
    const cells = Array.from(document.querySelectorAll('table.mat-mdc-table .mat-mdc-cell, table.mat-mdc-table .mat-mdc-header-cell'));
    const cellStyle = cells.length? (()=>{const cs=getComputedStyle(cells[0]); return {bg:cs.backgroundColor,color:cs.color, opacity:cs.opacity, display:cs.display};})():null;
    return {chain, cellCount:cells.length, cellStyle, bodyBg:getComputedStyle(document.body).backgroundColor, bodyColor:getComputedStyle(document.body).color};
  });
  console.log('LIGHT MODE:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
