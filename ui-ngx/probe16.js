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
  // Comprehensive visible-text check: only actual rendered elements with visible text
  const info = await page.evaluate(()=>{
    // Get all elements with visible text that have black color on dark bg (r<80)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const darkText = [];
    let node;
    while((node = walker.nextNode())){
      const p = node.parentElement;
      if(!p) continue;
      const cs = getComputedStyle(p);
      // only check elements that are actually rendered (not hidden, not scripts/styles)
      if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0") continue;
      if(p.tagName==="STYLE"||p.tagName==="SCRIPT"||p.tagName==="HEAD"||p.tagName==="TITLE") continue;
      if(p.tagName==="HTML") continue;
      const col = cs.color;
      const bg = cs.backgroundColor;
      const r = parseInt(bg.match(/\d+/g)?.[0]||"0");
      // black-ish text on dark bg
      if(col==="rgb(0, 0, 0)" && r < 80){
        darkText.push({tag:p.tagName, cls:(p.className&&String(p.className).slice(0,45))||"", text:node.textContent.trim().slice(0,40)});
      }
    }
    return {darkText, darkTextCount:darkText.length};
  });
  console.log("REAL VISIBLE TEXT ISSUES:", JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error("FATAL",e);process.exit(1)});
