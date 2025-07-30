const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 150,
  });

  const page = await browser.newPage();

  await page.goto("http://localhost:3004/");
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .fill("I need parts for the production line");
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .fill("I need a 15HP motor with 380V for standard shift operation");
  await page.getByRole("button", { name: "Advise me, but I want to" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Receiving Search Results$/ })
    .first()
    .click();
  await page
    .locator("span")
    .filter({ hasText: '"response":{...}4 items' })
    .getByRole("img")
    .first()
    .click();
  await page
    .locator("span")
    .filter({ hasText: '"products":[...]2 items' })
    .getByRole("img")
    .first()
    .click();
  await page
    .locator("span")
    .filter({ hasText: "0:{...}5 items" })
    .getByRole("img")
    .first()
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Receiving Search Results$/ })
    .first()
    .click();
  await page
    .getByRole("button", { name: "HD-2024 - Heavy-duty conveyor" })
    .click();
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .fill("Ask all 3 suppliers for their prices");
  await page.locator(".lucide.lucide-mail").click();
  await page
    .locator("div")
    .filter({ hasText: /^Email Sent Successfully$/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Analyze current offers (2" }).click();
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .fill("Track order status");
})();
