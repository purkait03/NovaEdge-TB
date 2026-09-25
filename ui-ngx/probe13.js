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
  const info = await page.evaluate(()=>{
    const table = document.querySelector("table.mat-mdc-table");
    const cell = table?table.querySelector(".mat-mdc-cell"):null;
    const hcell = table?table.querySelector(".mat-mdc-header-cell"):null;
    const cs=e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,color:s.color,op:s.opacity,disp:s.display,vis:s.visibility}};
    const content = document.querySelector(".tb-entity-table-content");
    return {
      url:location.href,
      body:{bg:getComputedStyle(document.body).backgroundColor,color:getComputedStyle(document.body).color},
      table: table?cs(table):null,
      cell: cell?cs(cell):null,
      hcell: hcell?cs(hcell):null,
      content: content?cs(content):null,
      rows: table?table.querySelectorAll(".mat-mdc-row").length:0,
      noData: !!document.querySelector(".tb-no-data-text"),
      noDataText: document.querySelector(".tb-no-data-text")?.textContent
    };
  });
  console.log("DARK (override OFF):", JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error("FATAL",e);process.exit(1)});
