// @ts-check
import { test, expect } from "@playwright/test";

// Ensure all components in DNS page behave as they should when device is disconnected
test("Device Disconnected - DNS Page", async ({ page }) => {
  await page.goto("http://172.17.0.1:3005/Modification/DNS");

  // Check if the ActiveModeControlSwitch is disabled and is off
  const ActiveModeControlSwitch = page
    .locator("data-test-id=ActiveModeControlSwitch")
    .locator("input");
  await expect(ActiveModeControlSwitch).toBeDisabled();
  await expect(ActiveModeControlSwitch).not.toBeChecked();
});

// Ensure all components in Analytics page behave as they should when device is disconnected
test("Device Disconnected - Analytics Page", async ({ page }) => {
  await page.goto("http://172.17.0.1:3005/Analytics");

  // Check if the EtherWeaselStatusChip displays Disconnected and has red background
  const EtherWeaselStatusChip = page.locator(
    "data-test-id=EtherWeaselStatusChip"
  );
  await expect(EtherWeaselStatusChip).toHaveText("Disconnected");
  await expect(EtherWeaselStatusChip).toHaveCSS(
    "background-color",
    "rgb(211, 47, 47)"
  );
});
