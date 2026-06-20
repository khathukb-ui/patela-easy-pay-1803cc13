# Patela Bluetooth setup notes

Bluetooth scanning is now wired into the existing device flow.

## What changed

- Added `@capacitor-community/bluetooth-le` to `package.json`.
- Added `src/services/patelaBluetooth.ts` for Patela BLE scan/connect logic.
- Updated `src/pages/device/DeviceBluetooth.tsx` so **Scan for Devices** performs a real BLE scan.
- Updated `src/pages/device/DeviceConfirmBluetooth.tsx` so **Pair This Device** connects to the selected BLE device and stores the paired device locally.
- Added iOS Bluetooth permission text to `ios/App/App/Info.plist`.
- Ran `npm run build` and `npx cap sync ios` successfully.

## Device names currently scanned

The scan filters nearby BLE devices by these Patela/model names:

- FP9310
- FP9320
- FP9340
- FP9810
- FP9800
- PATELA

You can override this using an env variable:

```env
VITE_PATELA_BLE_NAME_PREFIXES=FP9320,FP9340,PATELA
```

## Commands after downloading

```bash
npm install --legacy-peer-deps
npm run build
npx cap sync ios
npx cap open ios
```

Then run from Xcode on a real iPhone. Bluetooth testing usually needs a physical device, not only the simulator.

## Documentation note

The provided documentation contains EMV profile TLV XML and notes for country/currency tags:

- `9F1A` Terminal Country Code
- `5F2A` Transaction Currency Code

That does not include BLE service UUIDs or command characteristics, so this implementation handles discovery and connection first. Once the supplier provides the BLE service UUIDs/characteristics/commands, those can be added inside `src/services/patelaBluetooth.ts` without changing the screens again.
