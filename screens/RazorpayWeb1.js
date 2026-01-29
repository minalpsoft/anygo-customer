import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RazorpayWeb({ route, navigation }) {
  const bookingId = route?.params?.bookingId;
  const amount = route?.params?.amount; 

  const [order, setOrder] = useState(null);

  useEffect(() => {
    createOrder();
  }, []);

  const createOrder = async () => {
  const res = await fetch(`${API_BASE_URL}payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount, // 👈 send dynamic amount
    }),
  });

  const data = await res.json();
  setOrder(data);
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
            key: "${order.key}",   // FROM BACKEND
            amount: "${order.amount}",
            currency: "INR",
            name: "AnyGo",
            description: "Ride Payment",
            order_id: "${order.id}",

            prefill: {
              email: "test@anygo.com",
              contact: "9999999999"
            },

            notes: {
              bookingId: "${bookingId}"
            },

            theme: {
              color: "#1E90FF"
            },

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

        await fetch(`${API_BASE_URL}payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        navigation.replace('BookingSuccess', { bookingId });
      }}
    />
  );
}
