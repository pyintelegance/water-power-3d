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

            # 1. Rapid taps complete first mini-quest (15 taps) and unlock quest bar
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(200)")
            page.wait_for_timeout(120)
            for _ in range(15):
                page.keyboard.press("Space")
                page.wait_for_timeout(35)
            page.wait_for_timeout(200)

            assert page.locator("#quest-pill").is_visible(), "Quest pill did not appear"
            claim_btn = page.locator("#btn-quest-claim")
            assert claim_btn.is_visible(), "Quest claim button did not appear after 15 taps"
            crystals_before = page.evaluate("window.__WATER_POWER_DEBUG__.state.crystals")
            claim_btn.click()
            page.wait_for_timeout(150)
            crystals_after = page.evaluate("window.__WATER_POWER_DEBUG__.state.crystals")
            assert crystals_after > crystals_before, "Claiming quest did not award crystals"

            # 2. Spawn 3D Crystal Cargo Drone and catch it
            page.evaluate("window.__WATER_POWER_DEBUG__.world.spawnRiverEvent('drone'); window.__WATER_POWER_DEBUG__.refreshHud()")
            page.wait_for_timeout(400)
            ev_btn = page.locator("#btn-event-alert")
            assert ev_btn.is_visible(), "Event alert chip did not appear for drone"
            page.screenshot(path=os.path.join(SHOTS_DIR, "step3_drone_quest.png"))
            ev_btn.click()
            page.wait_for_timeout(200)
            assert page.evaluate("window.__WATER_POWER_DEBUG__.state.crystals") > crystals_after

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_STEP3_PASSED")


if __name__ == "__main__":
    main()
