import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT, "dist")
SHOTS_DIR = os.path.join(ROOT, "test_screenshots")
os.makedirs(SHOTS_DIR, exist_ok=True)


def main():
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", "4179", "--directory", DIST_DIR],
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
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
            page.on("pageerror", lambda err: errors.append(f"PAGEERROR: {err}"))
            page.on(
                "console",
                lambda msg: errors.append(f"CONSOLE_ERROR: {msg.text}") if msg.type == "error" else None,
            )

            page.goto("http://127.0.0.1:4179/", wait_until="networkidle")
            page.wait_for_timeout(1200)

            # Check canvas size & tap interaction
            box = page.locator("#game-canvas").bounding_box()
            assert box and box["width"] >= 380 and box["height"] >= 800, f"Bad canvas box: {box}"

            cash_before = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            page.mouse.click(180, 260)
            page.wait_for_timeout(200)
            cash_after = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            assert cash_after > cash_before, f"Tap did not increase cash: {cash_before} -> {cash_after}"

            shot_start = os.path.join(SHOTS_DIR, "mobile_start.png")
            page.screenshot(path=shot_start)

            # Unlock multiple stations & reach futuristic metropolis
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(50000000)")
            page.wait_for_timeout(200)

            for btn in page.locator(".buy-btn[data-action='station']").all():
                btn.click()
                page.wait_for_timeout(120)

            page.wait_for_timeout(900)
            era_text = page.locator("#hud-era").inner_text()
            watts_text = page.locator("#hud-watts").inner_text()
            print(f"UPGRADED_STATE: watts={watts_text}, era={era_text}")
            assert "мегаполис" in era_text.lower() or "эко-город" in era_text.lower(), f"Unexpected era: {era_text}"

            # Test tabs & camera preset cycle
            page.locator(".tab-btn[data-tab='upgrades']").click()
            page.wait_for_timeout(150)
            page.locator(".tab-btn[data-tab='prestige']").click()
            page.wait_for_timeout(150)
            page.locator(".tab-btn[data-tab='stations']").click()
            page.locator("#btn-cam").click()
            page.wait_for_timeout(600)

            shot_city = os.path.join(SHOTS_DIR, "mobile_metropolis.png")
            page.screenshot(path=shot_city)

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_PASSED")


if __name__ == "__main__":
    main()
