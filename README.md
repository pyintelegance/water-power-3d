# Water Power 3D — Hydro Tycoon

3D low-poly idle tycoon game built with **Three.js**, **Vite**, and **Capacitor (Android)**.

## Run Locally

```bash
npm install
npm run dev
```

## Build & Android Sync

```bash
npm run build
npx cap sync android
```

Push to `main` to trigger `.github/workflows/build-apk.yml` and download `app-debug.apk` from GitHub Actions artifacts.
