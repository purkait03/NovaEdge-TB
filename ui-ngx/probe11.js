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

  async function capture(tag){
    return page.evaluate((tag)=>{
      const table = document.querySelector('table.mat-mdc-table');
      const cs = getComputedStyle(document.body);
      const body = {bg:getComputedStyle(document.body).backgroundColor, color:getComputedStyle(document.body).color};
      const tableInfo = {};
      if(table){
        const tcs=getComputedStyle(table);
        tableInfo.table={bg:tcs.backgroundColor, color:tcs.color, opp:getComputedStyle(table).opacity, display:tcs.display, vis:tcs.visibility};
        const cell=table.querySelector('.mat-mdc-cell'); const hcell=table.querySelector('.mat-mdc-header-cell');
        if(cell){const ccs=getComputedStyle(cell); tableInfo.cell={bg:ccs.backgroundColor,color:ccs.color,opp:ccs.opacity,display:ccs.display};}
        if(hcell){const ccs=getComputedStyle(hcell); tableInfo.hcell={bg:ccs.backgroundColor,color:ccs.color,opp:ccs.opacity,display:ccs.display};}
        // walk up from table to find card/surface
        let el=table; tableInfo.surface=[];
        for(let i=0;i<8 && el;i++){
          const s=getComputedStyle(el);
          tableInfo.surface.push({tag:el.tagName, cls:(el.className&&String(el.className).slice(0,70))||'', bg:s.backgroundColor, color:s.color, opp:s.opacity, disp:s.display, vis:s.visibility, z:s.zIndex});
          el=el.parentElement;
        }
      }
      return {tag, body, table:tableInfo};
    },tag);
  }

  const light = await capture('LIGHT');
  console.log('=== '+light.tag+' ===');
  console.log('body bg:', light.body.bg, 'color:', light.body.color);
  console.log('table:', JSON.stringify(light.table.table));
  console.log('cell:', JSON.stringify(light.table.cell));
  console.log('hcell:', JSON.stringify(light.table.hcell));
  console.log('SURFACE CHAIN (bottom=table up to ancestors):');
  (light.table.surface||[]).reverse().forEach(s=>console.log('  ', JSON.stringify(s)));

  // toggle to dark by adding tb-dark class to body
  await page.evaluate(()=>{ document.body.classList.remove('tb-default'); document.body.classList.add('tb-dark'); });
  await sleep(1500);
  const dark = await capture('DARK');
  console.log('\n=== '+dark.tag+' ===');
  console.log('body bg:', dark.body.bg, 'color:', dark.body.color);
  console.log('table:', JSON.stringify(dark.table.table));
  console.log('cell:', JSON.stringify(dark.table.cell));
  console.log('hcell:', JSON.stringify(dark.table.hcell));
  console.log('SURFACE CHAIN (bottom=table up to ancestors):');
  (dark.table.surface||[]).reverse().forEach(s=>console.log('  ', JSON.stringify(s)));
  await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
