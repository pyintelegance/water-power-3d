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
        [sys.executable, "-m", "http.server", "4181", "--directory", DIST_DIR],
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

            page.goto("http://127.0.0.1:4181/", wait_until="networkidle")
            page.wait_for_timeout(1200)

            # Verify camera stays locked on pointer drag (no drag-rotation)
            cam_before = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.y, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            page.mouse.move(150, 320)
            page.mouse.down()
            page.mouse.move(270, 380, steps=8)
            page.mouse.up()
            page.wait_for_timeout(200)
            cam_after_drag = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.y, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            assert cam_before == cam_after_drag, f"Camera moved on drag: {cam_before} vs {cam_after_drag}"

            # Verify tapping increases cash and overdrive
            cash_before = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            page.mouse.click(180, 340)
            page.wait_for_timeout(150)
            cash_after = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
            assert cash_after > cash_before, f"Tap did not increase cash: {cash_before} -> {cash_after}"

            # Wait briefly to verify mining cycle payouts trigger
            page.wait_for_timeout(1800)
            mined = page.evaluate("window.__WATER_POWER_DEBUG__.state.stations.wood_wheel.totalMined")
            assert mined > 0, f"Mining cycle did not produce payout: {mined}"

            page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v2_start.png"))

            # Test camera preset buttons
            page.locator(".cam-btn[data-cam='3']").click()
            page.wait_for_timeout(600)
            cam_city = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            assert cam_city[0] != cam_before[0], "Camera view button did not move camera to City view"
            page.locator(".cam-btn[data-cam='0']").click()
            page.wait_for_timeout(500)

            # Unlock stations & check goal progression
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(50000000)")
            page.wait_for_timeout(150)
            for btn in page.locator(".buy-btn[data-action='station']").all():
                btn.click()
                page.wait_for_timeout(100)

            page.wait_for_timeout(900)
            goal_text = page.locator("#goal-title").inner_text()
            era_text = page.locator("#hud-era").inner_text()
            print(f"UPGRADED_V2: era={era_text}, goal={goal_text}")

            page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v2_upgraded.png"))
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_V2_PASSED")


if __name__ == "__main__":
    main()
