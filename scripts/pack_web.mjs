import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(rootDir, "dist");
const portalDir = path.join(rootDir, "portal_build");
const zipPath = path.join(rootDir, "water-power-3d-web.zip");

let html = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

// Inline linked CSS files and remove crossorigin attributes
html = html.replace(
  /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi,
  (_match, href) => {
    const cleanRel = href.replace(/^\.\//, "");
    const cssPath = path.join(distDir, cleanRel);
    const css = fs.readFileSync(cssPath, "utf8");
    return `<style>\n${css}\n</style>`;
  }
);

// Inline bundled module scripts and escape closing script tags safely
html = html.replace(
  /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/gi,
  (_match, src) => {
    const cleanRel = src.replace(/^\.\//, "");
    const jsPath = path.join(distDir, cleanRel);
    const js = fs.readFileSync(jsPath, "utf8").replace(/<\/script>/gi, "<\\/script>");
    return `<script type="module">\n${js}\n</script>`;
  }
);

fs.mkdirSync(portalDir, { recursive: true });
const singleHtmlPath = path.join(portalDir, "index.html");
fs.writeFileSync(singleHtmlPath, html, "utf8");

// Create ZIP with proper POSIX 0644 file permissions for Linux CDNs (itch.io / Yandex / CrazyGames)
const pyScript = `
import zipfile, os
zip_path = r"${zipPath}"
src_html = r"${singleHtmlPath}"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    zi = zipfile.ZipInfo("index.html")
    zi.create_system = 3
    zi.external_attr = (0o100644 << 16)
    with open(src_html, "rb") as f:
        zf.writestr(zi, f.read())
print("PACKED_ZIP_BYTES:", os.path.getsize(zip_path))
`;
execFileSync("python", ["-c", pyScript], { stdio: "inherit" });
