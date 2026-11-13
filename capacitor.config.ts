import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inbde.dentalprep',
  appName: 'Dental Prep Pro: INBDE',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash_icon",
      androidScaleType: "FIT_CENTER",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#0284c7",
      splashFullScreen: false,
      splashImmersive: false,
      layoutName: "launch_screen",
      useDialog: true
    },
  },
};

export default config;
