import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.patela.easypay',
  appName: 'Patela',
  webDir: 'dist',

  // ── Native iOS/Android shell config ──────────────────────────────────────
  ios: {
    contentInset: 'automatic',          // respect safe areas (notch, home bar)
    backgroundColor: '#2D1B69',         // Patela primary purple (matches splash)
    allowsLinkPreview: false,
    scrollEnabled: false,               // disable rubber-band; app handles scrolling
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    handleApplicationNotifications: true,
  },
  android: {
    backgroundColor: '#2D1B69',
    allowMixedContent: false,
    captureInput: true,                 // keeps keyboard from shifting layout
    webContentsDebuggingEnabled: false, // set to true during dev builds only
    initialFocus: false,
  },

  // ── Plugins ──────────────────────────────────────────────────────────────
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 400,
      backgroundColor: '#2D1B69',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',                   // white icons on Patela's dark header
      backgroundColor: '#2D1B69',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',                   // push content up rather than overlapping
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#00C8E0',             // Patela accent cyan
    },
    Camera: {
      permissions: ['camera'],
    },
    Haptics: {},
  },
};

export default config;
