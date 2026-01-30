export default {
  expo: {
    name: "anygo-customer",
    slug: "anygo-customer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FF1E1E",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.minalpsoft.anygocustomer",
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
      edgeToEdgeEnabled: true,
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: ["expo-font"],

    extra: {
      eas: {
        projectId: "613ca930-c51a-4f89-984a-339c882555cb",
      },
    },
  },
};
