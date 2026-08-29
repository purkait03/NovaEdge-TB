const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e=>console.log('PAGE ERROR:', String(e).slice(0,300)));
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200/', {waitUntil:'domcontentloaded', timeout:60000});
  // wait for login form
  await page.waitForSelector('#username-input', {timeout:60000});
  await page.type('#username-input', 'tenant@thingsboard.org');
  await page.type('#password-input', 'tenant');
  await page.click('button[type=submit]');
  // wait for navigation away from login
  let url='';
  for(let i=0;i<30;i++){
    await sleep(2000);
    url = page.url();
    console.log('tick',i,'url',url);
    if(!url.includes('/login')) break;
  }
  await sleep(3000);
  const info = await page.evaluate(()=>({url:location.href, bodyClass:document.body.className}));
  console.log('AFTER LOGIN:', JSON.stringify(info));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
