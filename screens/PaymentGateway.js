import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function PaymentGateway({ route, navigation }) {
  const { bookingId, finalFare } = route.params;

  useEffect(() => {
    openPayment();
  }, []);

  const openPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // 1️⃣ Create order (backend already knows amount from booking)
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

      const order = await res.json();

      if (!order?.id) {
        throw new Error('Order creation failed');
      }

      // 2️⃣ Razorpay options
      const options = {
        key: order.key,
        amount: order.amount, // paise
        currency: 'INR',
        name: 'AnyGo',
        description: 'Ride Payment',
        order_id: order.id,
        prefill: {
          contact: '9999999999',
          email: 'test@anygo.com',
        },
        theme: { color: '#3399cc' },
      };

      // 3️⃣ Open Razorpay
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // ✅ VERIFY PAYMENT
          await verifyPayment(data, token);

          navigation.replace('BookingSuccess', { bookingId });
        })
        .catch((error) => {
          console.log('❌ Razorpay cancelled:', error);
          Alert.alert('Payment cancelled');
          navigation.goBack();
        });

    } catch (err) {
      console.log('❌ Payment init error:', err);
      Alert.alert('Unable to start payment');
      navigation.goBack();
    }
  };

  const verifyPayment = async (data, token) => {
    const res = await fetch(`${API_BASE_URL}payment/verify`, {
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

    if (!res.ok) {
      throw new Error('Payment verification failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
