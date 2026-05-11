/**
 * useNative – Capacitor native API bridge
 *
 * Drop-in replacement for the existing web-only behaviour.
 * Each function gracefully no-ops when running in the browser.
 */

import { useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// --- lazy imports so web builds don't bundle native modules ----------------
const isNative = Capacitor.isNativePlatform();

let StatusBar: any = null;
let SplashScreen: any = null;
let Haptics: any = null;
let HapticsImpactStyle: any = null;
let HapticsNotificationType: any = null;
let Network: any = null;
let App: any = null;
let Keyboard: any = null;
let ScreenOrientation: any = null;

if (isNative) {
  import('@capacitor/status-bar').then((m) => { StatusBar = m.StatusBar; });
  import('@capacitor/splash-screen').then((m) => { SplashScreen = m.SplashScreen; });
  import('@capacitor/haptics').then((m) => {
    Haptics = m.Haptics;
    HapticsImpactStyle = m.ImpactStyle;
    HapticsNotificationType = m.NotificationType;
  });
  import('@capacitor/network').then((m) => { Network = m.Network; });
  import('@capacitor/app').then((m) => { App = m.App; });
  import('@capacitor/keyboard').then((m) => { Keyboard = m.Keyboard; });
}

// ---------------------------------------------------------------------------
// Status Bar
// ---------------------------------------------------------------------------
export async function setStatusBarLight() {
  if (!StatusBar) return;
  await StatusBar.setStyle({ style: 'LIGHT' });
  await StatusBar.setBackgroundColor({ color: '#2D1B69' });
}

export async function setStatusBarDark() {
  if (!StatusBar) return;
  await StatusBar.setStyle({ style: 'DARK' });
}

export async function hideStatusBar() {
  if (!StatusBar) return;
  await StatusBar.hide();
}

export async function showStatusBar() {
  if (!StatusBar) return;
  await StatusBar.show();
}

// ---------------------------------------------------------------------------
// Splash Screen
// ---------------------------------------------------------------------------
export async function hideSplashScreen() {
  if (!SplashScreen) return;
  await SplashScreen.hide({ fadeOutDuration: 400 });
}

// ---------------------------------------------------------------------------
// Haptics
// ---------------------------------------------------------------------------
/** Light tap – button presses */
export async function hapticLight() {
  if (!Haptics || !HapticsImpactStyle) return;
  await Haptics.impact({ style: HapticsImpactStyle.Light });
}

/** Medium bump – selections, toggles */
export async function hapticMedium() {
  if (!Haptics || !HapticsImpactStyle) return;
  await Haptics.impact({ style: HapticsImpactStyle.Medium });
}

/** Heavy thud – destructive actions */
export async function hapticHeavy() {
  if (!Haptics || !HapticsImpactStyle) return;
  await Haptics.impact({ style: HapticsImpactStyle.Heavy });
}

/** Success notification vibration */
export async function hapticSuccess() {
  if (!Haptics || !HapticsNotificationType) return;
  await Haptics.notification({ type: HapticsNotificationType.Success });
}

/** Error vibration */
export async function hapticError() {
  if (!Haptics || !HapticsNotificationType) return;
  await Haptics.notification({ type: HapticsNotificationType.Error });
}

/** Warning vibration */
export async function hapticWarning() {
  if (!Haptics || !HapticsNotificationType) return;
  await Haptics.notification({ type: HapticsNotificationType.Warning });
}

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------
export async function getNetworkStatus(): Promise<{ connected: boolean; type: string }> {
  if (!Network) {
    return { connected: navigator.onLine, type: 'unknown' };
  }
  const status = await Network.getStatus();
  return { connected: status.connected, type: status.connectionType };
}

export function useNetworkListener(
  onChange: (connected: boolean, type: string) => void
) {
  useEffect(() => {
    if (!Network) {
      // Fallback for web
      const handle = () => onChange(navigator.onLine, 'unknown');
      window.addEventListener('online', handle);
      window.addEventListener('offline', handle);
      return () => {
        window.removeEventListener('online', handle);
        window.removeEventListener('offline', handle);
      };
    }

    let handle: any;
    Network.addListener('networkStatusChange', (status: any) => {
      onChange(status.connected, status.connectionType);
    }).then((h: any) => { handle = h; });

    return () => { handle?.remove(); };
  }, [onChange]);
}

// ---------------------------------------------------------------------------
// Back Button (Android hardware back)
// ---------------------------------------------------------------------------
export function useHardwareBack(onBack: () => void) {
  useEffect(() => {
    if (!App) return;

    let handle: any;
    App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
      if (canGoBack) {
        onBack();
      } else {
        App.exitApp();
      }
    }).then((h: any) => { handle = h; });

    return () => { handle?.remove(); };
  }, [onBack]);
}

// ---------------------------------------------------------------------------
// Keyboard
// ---------------------------------------------------------------------------
export function useKeyboardAware(
  onShow?: (height: number) => void,
  onHide?: () => void
) {
  useEffect(() => {
    if (!Keyboard) return;

    let showHandle: any;
    let hideHandle: any;

    Keyboard.addListener('keyboardWillShow', (info: { keyboardHeight: number }) => {
      onShow?.(info.keyboardHeight);
    }).then((h: any) => { showHandle = h; });

    Keyboard.addListener('keyboardWillHide', () => {
      onHide?.();
    }).then((h: any) => { hideHandle = h; });

    return () => {
      showHandle?.remove();
      hideHandle?.remove();
    };
  }, [onShow, onHide]);
}

// ---------------------------------------------------------------------------
// Platform helpers
// ---------------------------------------------------------------------------
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isWeb = Capacitor.getPlatform() === 'web';
export const platform = Capacitor.getPlatform();
