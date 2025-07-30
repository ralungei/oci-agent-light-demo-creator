const { chromium } = require("playwright");

(async () => {
  console.log("🎬 Iniciando demo automática...\n");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
    args: ["--window-size=1400,900"],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  await page.goto("http://localhost:3004/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  console.log("📝 Escribiendo primera consulta...");
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .type("I need parts for the production line", { delay: 120 });
  await page.waitForTimeout(1000);

  console.log("✏️ Refinando la búsqueda...");
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .click({ clickCount: 3 });
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .type("I need a 15HP motor with 380V for standard shift operation", {
      delay: 100,
    });
  await page.waitForTimeout(1500);

  console.log("🔍 Iniciando búsqueda...");
  await page.getByRole("button", { name: "Advise me, but I want to" }).hover();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Advise me, but I want to" }).click();

  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);

  console.log("📊 Explorando resultados JSON...");
  await page
    .locator("div")
    .filter({ hasText: /^Receiving Search Results$/ })
    .first()
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page
    .locator("div")
    .filter({ hasText: /^Receiving Search Results$/ })
    .first()
    .click();
  await page.waitForTimeout(800);

  await page
    .locator("span")
    .filter({ hasText: '"response":{...}4 items' })
    .getByRole("img")
    .first()
    .click();
  await page.waitForTimeout(600);

  await page
    .locator("span")
    .filter({ hasText: '"products":[...]2 items' })
    .getByRole("img")
    .first()
    .click();
  await page.waitForTimeout(600);

  await page
    .locator("span")
    .filter({ hasText: "0:{...}5 items" })
    .getByRole("img")
    .first()
    .click();
  await page.waitForTimeout(1000);

  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(1000);

  console.log("🛠️ Seleccionando producto...");
  await page
    .locator("div")
    .filter({ hasText: /^Receiving Search Results$/ })
    .first()
    .click();
  await page.waitForTimeout(500);

  await page
    .getByRole("button", { name: "HD-2024 - Heavy-duty conveyor" })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page
    .getByRole("button", { name: "HD-2024 - Heavy-duty conveyor" })
    .hover();
  await page.waitForTimeout(300);
  await page
    .getByRole("button", { name: "HD-2024 - Heavy-duty conveyor" })
    .click();

  await page.waitForTimeout(1500);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  );
  await page.waitForTimeout(1500);

  console.log("💰 Solicitando cotizaciones...");
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .type("Ask all 3 suppliers for their prices", { delay: 110 });
  await page.waitForTimeout(1500);

  console.log("📧 Enviando emails...");
  await page.locator(".lucide.lucide-mail").hover();
  await page.waitForTimeout(300);
  await page.locator(".lucide.lucide-mail").click();

  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);

  await page
    .locator("div")
    .filter({ hasText: /^Email Sent Successfully$/ })
    .first()
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page
    .locator("div")
    .filter({ hasText: /^Email Sent Successfully$/ })
    .first()
    .click();
  await page.waitForTimeout(1000);

  console.log("📈 Analizando ofertas...");
  await page
    .getByRole("button", { name: "Analyze current offers (2" })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Analyze current offers (2" }).hover();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Analyze current offers (2" }).click();

  await page.waitForTimeout(1500);

  console.log("📦 Rastreando pedido...");
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("textbox", { name: "Type anything..." }).click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "Type anything..." })
    .type("Track order status", { delay: 120 });

  await page.waitForTimeout(3000);

  console.log("\n✨ ¡Demo completada con éxito!");
  console.log("🎯 La ventana permanecerá abierta para revisión");
})();
