# Patela EasyPay — Hybrid Mobile App Conversion Guide

> **React + Vite → Capacitor iOS & Android**
>
> This guide walks you step-by-step from the existing web codebase to a
> production-ready `.ipa` (iOS) and `.apk`/`.aab` (Android) hybrid app.

---

## What Was Changed

The conversion patch adds:

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Switches from remote URL to local `dist/` build; adds native plugin config |
| `src/App.tsx` | Native init (status bar, splash hide, hardware back, network) |
| `src/hooks/useNative.ts` | Type-safe Capacitor bridge — haptics, network, keyboard, back button |
| `src/mobile.css` | Safe areas, touch optimisations, keyboard avoidance, NFC animation |
| `src/components/patela/BottomNav.tsx` | Home indicator clearance + haptic taps |
| `package.json` | 9 new `@capacitor/*` native plugins + `mobile:*` build scripts |
| `android-manifest-additions.xml` | All required Android permissions |
| `ios-info-plist-additions.xml` | All required iOS usage strings |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| Xcode | ≥ 15 | Mac App Store (iOS only) |
| Android Studio | ≥ 2023 | https://developer.android.com/studio |
| JDK | ≥ 17 | Bundled with Android Studio |
| CocoaPods | latest | `sudo gem install cocoapods` (iOS) |
| Capacitor CLI | ≥ 6 | Installed via `npm install` |

---

## Step 1 – Apply the Patch Files

Copy the changed files from this package into your project root, replacing the originals:

```bash
# From inside patela-easy-pay-1803cc13-main/
cp /path/to/patch/capacitor.config.ts          ./capacitor.config.ts
cp /path/to/patch/src/App.tsx                  ./src/App.tsx
cp /path/to/patch/src/hooks/useNative.ts       ./src/hooks/useNative.ts
cp /path/to/patch/src/mobile.css               ./src/mobile.css
cp /path/to/patch/src/components/patela/BottomNav.tsx \
                                               ./src/components/patela/BottomNav.tsx
cp /path/to/patch/package.json                 ./package.json
```

---

## Step 2 – Import mobile.css

Add one line to the **top** of `src/index.css`:

```css
@import './mobile.css';   /* ← ADD THIS LINE */
@import url('https://fonts.googleapis.com/...');
@tailwind base;
…
```

---

## Step 3 – Install Dependencies

```bash
npm install
```

This installs the 9 new Capacitor plugins:

- `@capacitor/app` — app lifecycle, hardware back button
- `@capacitor/camera` — card scan, proof upload
- `@capacitor/haptics` — vibration feedback
- `@capacitor/keyboard` — keyboard resize events
- `@capacitor/local-notifications` — payment reminders
- `@capacitor/network` — offline/online detection
- `@capacitor/push-notifications` — payment alerts
- `@capacitor/screen-orientation` — portrait lock
- `@capacitor/splash-screen` — native splash control
- `@capacitor/status-bar` — status bar colour

---

## Step 4 – Build the Web App

```bash
npm run build
```

This outputs your built app into `dist/` — Capacitor wraps this into the native shell.

---

## Step 5 – Add Native Platforms

```bash
# Run once; creates ios/ and android/ folders
npx cap add ios
npx cap add android

# Sync your build into the native projects
npx cap sync
```

> **Every time you run `npm run build`**, follow it with `npx cap sync` to
> push the latest web bundle to both native projects.

---

## Step 6 – Android Permissions

Open `android/app/src/main/AndroidManifest.xml` and add all entries from
`android-manifest-additions.xml` (provided in this patch).

Also update your `<application>` tag:
```xml
android:hardwareAccelerated="true"
```

And the main `<activity>` tag:
```xml
android:windowSoftInputMode="adjustResize"
android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
```

---

## Step 7 – iOS Permissions

Open `ios/App/App/Info.plist` and add all `<key>/<string>` pairs from
`ios-info-plist-additions.xml` (provided in this patch).

Apple will **reject** your app without matching usage strings for any
permission your code requests.

---

## Step 8 – Run on a Device

### Android
```bash
# Open Android Studio (you'll need to select a device/emulator)
npm run mobile:android

# OR run directly from CLI on a connected device:
npm run mobile:run:android
```

### iOS (Mac required)
```bash
# Open Xcode
npm run mobile:ios

# OR run directly (needs Apple Developer account):
npm run mobile:run:ios
```

### Live Reload during Development
```bash
# Android only — hot reloads on save
npm run mobile:live:android
```

---

## Step 9 – App Icons & Splash Screen

Use the Capacitor Assets tool to auto-generate all icon sizes:

```bash
npm install -g @capacitor/assets

# Place your source files:
# resources/icon.png        (1024×1024, no transparency)
# resources/splash.png      (2732×2732)
# resources/splash-dark.png (optional dark mode)

npx capacitor-assets generate
```

---

## Native Feature Map

| Feature | Plugin | Used In |
|---------|--------|---------|
| Haptic feedback | `@capacitor/haptics` | All buttons, payment success/fail |
| Status bar colour | `@capacitor/status-bar` | App init, page transitions |
| Native splash | `@capacitor/splash-screen` | App launch |
| Hardware back | `@capacitor/app` | All pages (Android) |
| Network state | `@capacitor/network` | OfflineBanner, payment gating |
| Keyboard resize | `@capacitor/keyboard` | Payment keypad, forms |
| Camera | `@capacitor/camera` | BankCardScan, BankUploadProof |
| Push notifications | `@capacitor/push-notifications` | Payment alerts |
| Screen lock | `@capacitor/screen-orientation` | Portrait only |

---

## Adding Haptics to Buttons (Quick Reference)

```tsx
import { hapticLight, hapticSuccess, hapticError } from '@/hooks/useNative';

// Light tap — any button press
<Button onClick={() => { hapticLight(); doSomething(); }}>Tap</Button>

// Success — payment completed
hapticSuccess();

// Error — payment failed
hapticError();
```

---

## Safe Area Utilities (CSS)

The `mobile.css` patch adds CSS custom properties and utility classes:

```css
/* Available anywhere in your CSS */
var(--safe-top)     /* top inset — notch / Dynamic Island */
var(--safe-bottom)  /* bottom inset — home indicator */
var(--safe-left)    /* left inset */
var(--safe-right)   /* right inset */
```

Use the `patela-header` class on your `<header>` and `patela-bottom-nav`
on your `<nav>` to automatically apply the correct padding.

---

## Production Build Checklist

- [ ] `npm run build` passes with no errors
- [ ] `npx cap sync` completed after build
- [ ] App icon + splash screen generated (`npx capacitor-assets generate`)
- [ ] Android: `webContentsDebuggingEnabled` set to `false` in `capacitor.config.ts`
- [ ] iOS: Bundle ID matches your Apple Developer Portal app ID
- [ ] Android: `applicationId` in `android/app/build.gradle` matches `za.co.patela.easypay`
- [ ] Supabase production URL set in `.env`
- [ ] All permission strings present in `Info.plist`
- [ ] All permissions present in `AndroidManifest.xml`
- [ ] Keystore created and stored securely for Android signing
- [ ] iOS provisioning profile + certificate configured in Xcode

---

## Troubleshooting

**"Missing @capacitor/status-bar" at runtime**
→ Run `npm install` then `npx cap sync`.

**Status bar overlaps the header**
→ Add class `patela-header` to your `<header>` elements, or manually add
  `padding-top: var(--safe-top)`.

**Keyboard covers the payment keypad**
→ Ensure `Keyboard.resize = 'body'` is in `capacitor.config.ts` (already set).
  Wrap the keypad in `<div className="keyboard-avoid">`.

**Android back button navigates out of the app**
→ Confirm `HardwareBackHandler` component is rendered inside `<BrowserRouter>`.

**iOS app rejected — missing usage description**
→ Add the relevant `NS*UsageDescription` from `ios-info-plist-additions.xml`.

**Splash screen stays visible**
→ Check that `hideSplashScreen()` is called from `App.tsx` after the JS
  has mounted (it's set up with a 2.8 s safety timer).
