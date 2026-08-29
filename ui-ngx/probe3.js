const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:['--no-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  page.on('console', m => console.log('['+m.type()+']', m.text().slice(0,400)));
  page.on('pageerror', e => console.log('PAGE ERROR:', String(e).slice(0,500)));
  await page.setViewport({width:1440,height:900});
  await page.goto('http://localhost:4200', {waitUntil:'domcontentloaded', timeout:60000});
  // wait longer for app to bootstrap
  await page.waitForTimeout(15000);
  const info = await page.evaluate(()=>{
    const appRoot = document.querySelector('app-root');
    return {
      url: location.href,
      bodyClass: document.body.className,
      hasAppRoot: !!appRoot,
      appRootChildren: appRoot ? appRoot.children.length : -1,
      appRootHtml: appRoot ? appRoot.innerHTML.slice(0,400) : null,
      bodyChildren: document.body.children.length,
      spinner: !!document.querySelector('.tb-loading-spinner')
    };
  });
  console.log('INFO:', JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
