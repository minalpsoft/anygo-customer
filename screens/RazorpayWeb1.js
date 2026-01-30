import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RazorpayWeb1({ route, navigation }) {
  const bookingId = route?.params?.bookingId;
  const amount = route?.params?.amount;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    createOrder();
  }, []);

  const createOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        `${API_BASE_URL}payment/create-order/${bookingId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log('🧾 Razorpay order:', data);

      setOrder(data);
    } catch (err) {
      console.log('❌ createOrder error:', err);
    }
  };

  if (!order) return null;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>

  <body>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

    <script>
      var options = {
        key: "${order.key}",
        amount: "${order.amount}",
        currency: "INR",
        name: "AnyGo",
        description: "Ride Payment",
        order_id: "${order.id}",

        handler: function (response) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify(response)
          );
        },

        modal: {
          ondismiss: function () {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ cancelled: true })
            );
          }
        }
      };

      var rzp = new Razorpay(options);
      rzp.open();
    </script>
  </body>
</html>
`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="always"
      onMessage={async (event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.cancelled) {
          navigation.goBack();
          return;
        }

        const token = await AsyncStorage.getItem('token');

        await fetch(`${API_BASE_URL}payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
          }),
        });

        navigation.replace('BookingSuccess', { bookingId });
      }}
    />
  );
}
