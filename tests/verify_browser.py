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
        [sys.executable, "-m", "http.server", "4187", "--directory", PORTAL_DIR],
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
            page.on(
                "console",
                lambda msg: errors.append(f"CONSOLE_ERROR: {msg.text}") if msg.type == "error" else None,
            )

            page.goto("http://127.0.0.1:4187/", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Unlock valley stations to reach 1.8 MW & trigger Zone 2 transition button
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(500000000)")
            page.wait_for_timeout(150)
            for _ in range(3):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(50)
            page.wait_for_timeout(400)

            adv_btn = page.locator("#btn-advance-zone")
            assert adv_btn.is_visible(), "Advance to Glacier button did not appear!"
            adv_btn.click()
            page.wait_for_timeout(200)
            page.locator("#btn-confirm-zone").click()
            page.wait_for_timeout(600)

            zone_id = page.evaluate("window.__WATER_POWER_DEBUG__.state.activeZoneId")
            first_station = page.locator(".card-title span").first.inner_text()
            cash_after = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            print(f"TRANSITION_OK: zone={zone_id}, first_station={first_station}, reset_cash={cash_after}")
            assert zone_id == "glacier"
            assert "Ледовое колесо" in first_station
            assert cash_after < 5000, f"Cash did not reset cleanly: {cash_after}"

            page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v5_glacier.png"))

            # Now test Glacier -> Cyber Canyon transition
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(5000000000)")
            page.wait_for_timeout(150)
            for _ in range(3):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(50)
            page.wait_for_timeout(400)
            assert adv_btn.is_visible(), "Advance to Cyber button did not appear!"
            adv_btn.click()
            page.wait_for_timeout(200)
            page.locator("#btn-confirm-zone").click()
            page.wait_for_timeout(600)

            zone_id2 = page.evaluate("window.__WATER_POWER_DEBUG__.state.activeZoneId")
            first_station2 = page.locator(".card-title span").first.inner_text()
            print(f"TRANSITION_2_OK: zone={zone_id2}, first_station={first_station2}")
            assert zone_id2 == "cyber"
            assert "Плазма-ротор" in first_station2

            page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v5_cyber.png"))
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_V5_PASSED")


if __name__ == "__main__":
    main()
