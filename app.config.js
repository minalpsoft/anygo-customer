export default {
  expo: {
    name: "anygo-customer",
    slug: "anygo-customer",
    android: {
      package: "com.minalpsoft.anygocustomer",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
  },
};
