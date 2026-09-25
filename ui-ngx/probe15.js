const puppeteer = require("puppeteer-core");
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args:["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900});
  await page.goto("http://localhost:4200/", {waitUntil:"domcontentloaded", timeout:60000});
  await page.waitForSelector("#username-input", {timeout:60000});
  await page.type("#username-input", "tenant@thingsboard.org");
  await page.type("#password-input", "tenant");
  await page.click("button[type=submit]");
  await page.waitForFunction(()=>!location.href.includes("/login"), {timeout:60000});
  await sleep(3000);
  await page.evaluate(()=>{ history.pushState({},"", "/customers"); location.reload(); });
  await sleep(10000);
  await page.evaluate(()=>{ document.body.classList.remove("tb-default"); document.body.classList.add("tb-dark"); });
  await sleep(1500);
  // Check: does .tb-dark { color: var(--tb-text-primary) } now apply to body?
  const info = await page.evaluate(()=>{
    const body = document.body;
    const cs = getComputedStyle(body);
    const table = document.querySelector("table.mat-mdc-table");
    const cell = table?table.querySelector(".mat-mdc-cell"):null;
    const cs2=e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,color:s.color,op:s.opacity}};
    const all = document.querySelectorAll("*");
    let issues=[]; let checked=0;
    all.forEach(el=>{
      const c = getComputedStyle(el).color;
      const b = getComputedStyle(el).backgroundColor;
      const r = parseInt(b.match(/\d+/g)?.[0]||"0");
      // black text on dark bg
      if(c==="rgb(0, 0, 0)" && r < 80 && el.textContent.trim()){
        issues.push({tag:el.tagName, cls:(el.className&&String(el.className).slice(0,40))||"", text:el.textContent.trim().slice(0,30)});
      }
      checked++;
      if(checked>2500) return;
    });
    return {
      bodyColor:cs.color, bodyBg:cs.backgroundColor,
      cellColor:cell?cs2(cell).color:null,
      issues:issues.slice(0,30), issueCount:issues.length
    };
  });
  console.log("AFTER FIX:", JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error("FATAL",e);process.exit(1)});
