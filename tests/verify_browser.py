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
        [sys.executable, "-m", "http.server", "4183", "--directory", DIST_DIR],
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

            page.goto("http://127.0.0.1:4183/", wait_until="networkidle")
            page.wait_for_timeout(1200)

            # 1. Pan toggle OFF -> drag must NOT move camera
            cam_before = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            page.mouse.move(160, 350)
            page.mouse.down()
            page.mouse.move(260, 400, steps=6)
            page.mouse.up()
            page.wait_for_timeout(200)
            cam_locked = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            assert cam_before == cam_locked, f"Camera moved when pan OFF: {cam_before} vs {cam_locked}"

            # 2. Pan toggle ON -> drag translates camera position (without rotating)
            page.locator("#btn-pan-toggle").click()
            page.mouse.move(160, 350)
            page.mouse.down()
            page.mouse.move(270, 410, steps=8)
            page.mouse.up()
            page.wait_for_timeout(300)
            cam_panned = page.evaluate(
                "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
            )
            assert cam_panned != cam_locked, "Camera did not pan when pan toggle ON"

            # Turn pan OFF & reset to Overview
            page.locator("#btn-pan-toggle").click()
            page.locator(".cam-btn[data-cam='0']").click()
            page.wait_for_timeout(350)

            # 3. Test Profile modal & collapsible goal banner
            page.locator("#btn-profile").click()
            page.wait_for_timeout(200)
            assert not page.locator("#profile-modal").evaluate("el => el.classList.contains('hidden')")
            page.locator("#profile-name-input").fill("Тест-Магнат")
            page.locator("#btn-close-profile").click()

            page.locator("#btn-goal-collapse").click()
            page.wait_for_timeout(120)
            assert page.locator("#goal-banner").evaluate("el => el.classList.contains('collapsed')")
            page.locator("#btn-goal-collapse").click()

            # 4. Test Shop tab + buying Rain booster
            page.locator(".tab-btn[data-tab='shop']").click()
            page.wait_for_timeout(200)
            page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v3_shop.png"))

            # 5. Unlock Zone 2 (Glacier) and switch to it
            page.locator(".tab-btn[data-tab='stations']").click()
            page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(500000000)")
            page.wait_for_timeout(150)
            for _ in range(3):
                for btn in page.locator(".buy-btn[data-action='station']").all():
                    btn.click()
                    page.wait_for_timeout(60)
            page.wait_for_timeout(500)

            glacier_chip = page.locator(".zone-chip[data-zone-id='glacier']")
            assert not glacier_chip.is_disabled(), "Zone 2 Glacier did not unlock!"
            glacier_chip.click()
            page.wait_for_timeout(600)

            page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v3_glacier.png"))
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_V3_PASSED")


if __name__ == "__main__":
    main()
