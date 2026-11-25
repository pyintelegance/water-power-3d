import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT, "dist")
SHOTS_DIR = os.path.join(ROOT, "test_screenshots")
os.makedirs(SHOTS_DIR, exist_ok=True)


def run_mobile_check(browser, errors):
    page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page.on("pageerror", lambda err: errors.append(f"MOBILE_PAGEERROR: {err}"))
    page.on(
        "console",
        lambda msg: errors.append(f"MOBILE_CONSOLE: {msg.text}") if msg.type == "error" else None,
    )

    page.goto("http://127.0.0.1:4185/", wait_until="networkidle")
    page.wait_for_timeout(1000)

    cam_before = page.evaluate(
        "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
    )
    page.mouse.move(160, 350)
    page.mouse.down()
    page.mouse.move(260, 400, steps=6)
    page.mouse.up()
    page.wait_for_timeout(180)
    cam_locked = page.evaluate(
        "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
    )
    assert cam_before == cam_locked, "Mobile camera moved with pan OFF"

    page.locator("#btn-pan-toggle").click()
    page.mouse.move(160, 350)
    page.mouse.down()
    page.mouse.move(270, 410, steps=8)
    page.mouse.up()
    page.wait_for_timeout(250)
    cam_panned = page.evaluate(
        "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
    )
    assert cam_panned != cam_locked, "Mobile camera did not pan with toggle ON"

    page.locator("#btn-pan-toggle").click()
    page.locator(".cam-btn[data-cam='0']").click()
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(SHOTS_DIR, "mobile_v4.png"))
    page.close()


def run_desktop_check(browser, errors):
    page = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
    page.on("pageerror", lambda err: errors.append(f"DESKTOP_PAGEERROR: {err}"))
    page.on(
        "console",
        lambda msg: errors.append(f"DESKTOP_CONSOLE: {msg.text}") if msg.type == "error" else None,
    )

    page.goto("http://127.0.0.1:4185/", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Sidebar must sit on the right side on PC
    drawer_box = page.locator("#drawer").bounding_box()
    assert drawer_box and drawer_box["x"] > 800, f"Drawer not in right sidebar on PC: {drawer_box}"

    # Spacebar triggers tap
    cash_before = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
    page.keyboard.press("Space")
    page.wait_for_timeout(150)
    cash_after = page.evaluate("window.__WATER_POWER_DEBUG__.state.cash")
    assert cash_after > cash_before, "Spacebar tap did not add cash"

    # WASD pans camera
    cam_before = page.evaluate(
        "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
    )
    page.keyboard.down("KeyW")
    page.wait_for_timeout(260)
    page.keyboard.up("KeyW")
    page.wait_for_timeout(150)
    cam_wasd = page.evaluate(
        "[window.__WATER_POWER_DEBUG__.world.camera.position.x, window.__WATER_POWER_DEBUG__.world.camera.position.z]"
    )
    assert cam_wasd != cam_before, "WASD did not pan camera on PC"

    # Mouse wheel zooms camera
    zoom_before = page.evaluate("window.__WATER_POWER_DEBUG__.world.desiredZoomScale")
    page.mouse.move(400, 400)
    page.mouse.wheel(0, -240)
    page.wait_for_timeout(200)
    zoom_after = page.evaluate("window.__WATER_POWER_DEBUG__.world.desiredZoomScale")
    assert zoom_after < zoom_before, f"Wheel did not zoom in: {zoom_before} -> {zoom_after}"

    # Unlock all & upgrade to show rich 3D PC view
    page.evaluate("window.__WATER_POWER_DEBUG__.grantCash(50000000)")
    page.wait_for_timeout(150)
    for _ in range(2):
        for btn in page.locator(".buy-btn[data-action='station']").all():
            btn.click()
            page.wait_for_timeout(50)
    page.wait_for_timeout(700)

    page.screenshot(path=os.path.join(SHOTS_DIR, "desktop_v4.png"))
    page.close()


def main():
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", "4185", "--directory", DIST_DIR],
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
            run_mobile_check(browser, errors)
            run_desktop_check(browser, errors)
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    if errors:
        print("ERRORS_DETECTED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("BROWSER_QA_V4_PASSED")


if __name__ == "__main__":
    main()
