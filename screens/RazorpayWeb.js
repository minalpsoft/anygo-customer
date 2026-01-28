import React from 'react';
import { WebView } from 'react-native-webview';

export default function RazorpayWeb({ route, navigation }) {
  const amount = route?.params?.amount ?? 1;
  const bookingId = route?.params?.bookingId ?? null;

  const finalFare = Number(amount) * 100;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>

      <body>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

        <script>
          function openRazorpay() {
            var options = {
              key: "rzp_test_RyWXVtaCyps0zs",
              amount: ${finalFare},
              currency: "INR",
              name: "AnyGo",
              description: "Ride Payment",
              redirect: false,   // ⭐ VERY IMPORTANT

              prefill: {
                email: "test@anygo.com",
                contact: "9999999999"
              },

              notes: {
                bookingId: "${bookingId}"
              },

              method: {
                upi: true,
                card: true,
                wallet: true,
                netbanking: true
              },

              handler: function (response) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    success: true,
                    paymentId: response.razorpay_payment_id
                  })
                );
              },

              modal: {
                ondismiss: function () {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ success: false })
                  );
                }
              }
            };

            var rzp = new Razorpay(options);
            rzp.open();
          }

          window.onload = openRazorpay;
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
      mixedContentMode="always"   // ⭐ ANDROID FIX
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.success) {
          navigation.replace('BookingSuccess', {
            bookingId,
            paymentId: data.paymentId,
          });
        } else {
          navigation.goBack();
        }
      }}
    />
  );
}
