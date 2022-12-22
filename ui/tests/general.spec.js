// @ts-check
import { test, expect } from "@playwright/test";

test("Routing Tests", async ({ page }) => {
  await page.goto("http://172.17.0.1:3005/");

  await page.getByRole("link", { name: "ETHER-WEASEL" }).click();
  await expect(page).toHaveURL("http://172.17.0.1:3005/");

  await page.getByRole("button", { name: "DNS" }).click();
  await expect(page).toHaveURL("http://172.17.0.1:3005/Modification/DNS");

  await page.getByRole("button", { name: "Analytics" }).click();
  await expect(page).toHaveURL("http://172.17.0.1:3005/Analytics");
});
