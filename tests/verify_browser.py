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

            # 1. Mobile portrait check (390x844)
            m_page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
            m_page.on("pageerror", lambda err: errors.append(f"MOBILE_PAGEERROR: {err}"))
            m_page.on("console", lambda m: errors.append(f"MOBILE_CONSOLE: {m.text}") if m.type == "error" else None)
            m_page.goto("http://127.0.0.1:4188/", wait_until="networkidle")
            m_page.wait_for_timeout(1000)
            m_page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v6.png"))
            m_page.close()

            # 2. Desktop widescreen check (1280x720) across all 3 locations
            page = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
            page.on("pageerror", lambda err: errors.append(f"PAGEERROR: {err}"))
            page.on("console", lambda m: errors.append(f"CONSOLE_ERROR: {m.text}") if m.type == "error" else None)

            page.goto("http://127.0.0.1:4188/", wait_until="networkidle")
            page.wait_for_timeout(1000)

            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(500000000)")
            page.wait_for_timeout(150)
            for _ in range(3):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(45)
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v6_valley.png"))

            adv_btn = page.locator("#btn-advance-zone")
            assert adv_btn.is_visible(), "Advance to Glacier button did not appear!"
            adv_btn.click()
            page.wait_for_timeout(200)
            page.locator("#btn-confirm-zone").click()
            page.wait_for_timeout(600)
            assert page.evaluate("window.__WATER_POWER_DEBUG__.state.activeZoneId") == "glacier"
            page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v6_glacier.png"))

            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(5000000000)")
            page.wait_for_timeout(150)
            for _ in range(3):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(45)
            page.wait_for_timeout(400)
            adv_btn.click()
            page.wait_for_timeout(200)
            page.locator("#btn-confirm-zone").click()
            page.wait_for_timeout(600)
            assert page.evaluate("window.__WATER_POWER_DEBUG__.state.activeZoneId") == "cyber"
            page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v6_cyber.png"))

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_V6_PASSED")


if __name__ == "__main__":
    main()
