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
    // Find all text-bearing elements and check for low-contrast (black text on dark bg)
    const all = document.querySelectorAll("*");
    const issues = [];
    let checked = 0;
    all.forEach(el => {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const col = cs.color;
      // Check if text color is dark (black-ish) on a dark background
      if (col && col !== "rgb(0, 0, 0)" && col !== "rgba(0, 0, 0, 0)") return; // skip non-black text
      if (bg === "rgba(0, 0, 0, 0)") return; // skip transparent bg (let parent show)
      // If bg is dark and color is black -> issue
      const r = parseInt(bg.match(/\d+/g)?.[0]||"0");
      if (r < 60 && col === "rgb(0, 0, 0)") {
        const tag = el.tagName;
        const cls = (el.className && String(el.className).slice(0,40)) || "";
        const text = el.textContent.trim().slice(0,30);
        if (text) issues.push({tag, cls, bg, col, text});
      }
      checked++;
      if (checked > 3000) return;
    });
    return {bodyColor:getComputedStyle(document.body).color, issues:issues.slice(0,40), issueCount:issues.length};
  });
  console.log("DARK TEXT-ISSUE CHECK:", JSON.stringify(info,null,2));
  await browser.close();
})().catch(e=>{console.error("FATAL",e);process.exit(1)});
