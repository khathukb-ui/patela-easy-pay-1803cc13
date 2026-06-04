import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patela.app',
  appName: 'Patela',
  webDir: 'dist',
  server: {
      url: "http://192.168.68.110:3000",
      cleartext: true,
  },
};

export default config;
