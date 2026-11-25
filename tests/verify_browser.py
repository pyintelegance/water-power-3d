import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTAL_DIR = os.path.join(ROOT, "portal_build")
SHOTS_DIR = os.path.join(ROOT, "test_screenshots")
os.makedirs(SHOTS_DIR, exist_ok=True)


def main():
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", "4188", "--directory", PORTAL_DIR],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.0)

    errors = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True,
                args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl"],
            )

            page = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
            page.on("pageerror", lambda err: errors.append(f"PAGEERROR: {err}"))
            page.on("console", lambda m: errors.append(f"CONSOLE_ERROR: {m.text}") if m.type == "error" else None)

            page.goto("http://127.0.0.1:4188/", wait_until="networkidle")
            page.wait_for_timeout(900)

            # 1. Verify clean onboarding on fresh start
            assert page.locator("#onboarding-hint").is_visible(), "Onboarding hint missing on start"
            assert not page.locator(".tab-btn[data-tab='shop']").is_visible(), "Shop should be hidden at start"
            page.screenshot(path=os.path.join(SHOTS_DIR, "step1_onboarding.png"))

            # 2. Rapid taps build Combo and spawn flying orbs
            for _ in range(5):
                page.keyboard.press("Space")
                page.wait_for_timeout(55)
            assert page.locator("#combo-pill").is_visible(), "Combo pill did not appear on rapid taps"

            # 3. Grant cash, unlock stations/tabs, verify onboarding clears
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(500000000)")
            page.wait_for_timeout(200)
            assert page.locator(".tab-btn[data-tab='shop']").is_visible(), "Shop did not unlock"
            assert not page.locator("#onboarding-hint").is_visible(), "Onboarding hint should hide after progress"
            for _ in range(2):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(45)
            page.wait_for_timeout(600)
            page.screenshot(path=os.path.join(SHOTS_DIR, "step2_valley_sky.png"))

            # 4. Test Reset button inside Profile modal
            page.locator("#btn-profile").click()
            page.wait_for_timeout(150)
            page.locator("#btn-reset-prompt").click()
            page.wait_for_timeout(100)
            assert page.locator("#reset-confirm-box").is_visible(), "Reset confirm box did not appear"
            page.locator("#btn-reset-confirm").click()
            page.wait_for_timeout(300)

            cash_after_reset = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            assert cash_after_reset < 20, f"Reset did not clear cash: {cash_after_reset}"

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_STEP1_PASSED")


if __name__ == "__main__":
    main()
