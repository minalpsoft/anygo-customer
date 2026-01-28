import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function SearchingDriver({ route, navigation }) {
    const { bookingId } = route.params;

    // const API_BASE_URL = 'http://10.197.26.200:5000/';

    const intervalRef = useRef(null);
    const startedAtRef = useRef(Date.now());

    const MAX_WAIT_TIME = 45 * 1000; // 45 seconds

    useEffect(() => {
        startPolling();

        return () => stopPolling();
    }, []);

    const startPolling = () => {
        intervalRef.current = setInterval(checkBookingStatus, 3000);
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const checkBookingStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(
                `${API_BASE_URL}booking/current`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            // ✅ DRIVER ACCEPTED
            if (data.status === 'DRIVER_ACCEPTED' ||
                data.status === 'DRIVER_ASSIGNED') {
                stopPolling();
                navigation.replace('Booking5', { bookingId });
                return;
            }

            const elapsed = Date.now() - startedAtRef.current;

            // ⏳ still waiting
            if (elapsed < MAX_WAIT_TIME) {
                return;
            }

            // ❌ TIMEOUT
            stopPolling();
            Alert.alert(
                'No Driver Found',
                'No driver accepted your booking.',
                [{ text: 'OK', onPress: () => navigation.popToTop() }]
            );

        } catch (err) {
            console.log('❌ STATUS CHECK ERROR', err.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 12, fontSize: 16 }}>
                Searching for nearby drivers...
            </Text>
        </View>
    );
}
