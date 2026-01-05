import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert, Button
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppSearch from '../components/AppSearch';
import MapView, { Marker } from 'react-native-maps';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import RideCard from '../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Booking3({ route, navigation }) {
    const {
        pickup,
        drop,
        distanceKm,
        durationMin,
        tripType,
    } = route.params;

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const API_BASE_URL = 'http://192.168.31.89:3000/';

    useEffect(() => {
        getEstimate();
    }, []);

    const getEstimate = async () => {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(`${API_BASE_URL}booking/estimate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                pickupLat: pickup.lat,
                pickupLng: pickup.lng,
                dropLat: drop.lat,
                dropLng: drop.lng,
            }),
        });

        const data = await res.json();
        console.log('ESTIMATE RESPONSE 👉', data);
        setVehicles(data.vehicles || []);
    };


    const handleConfirmBooking = async () => {
        if (!selectedVehicle) {
            Alert.alert('Error', 'Please select a vehicle');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(`${API_BASE_URL}booking/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vehicleType: selectedVehicle.vehicleType,
                    pickupLat: pickup.lat,
                    pickupLng: pickup.lng,
                    dropLat: drop.lat,
                    dropLng: drop.lng,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw data;

            navigation.navigate('Booking4', {
                // bookingId: data.bookingId,
                // vehicleType: selectedVehicle.vehicleType,
                // estimatedFare: selectedVehicle.estimatedFare,
                bookingId: data._id,
                vehicleType: selectedVehicle.vehicleType,
                estimatedFare: selectedVehicle.estimatedFare,
                distanceKm,
                durationMin,
            });

        } catch (err) {
            Alert.alert('Booking Failed', err?.message || 'No drivers found');
        }
    };



    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* RIDE CARD */}
                {vehicles.map(v => (
                    <RideCard
                        key={v.vehicleType}
                        style={[
                            selectedVehicle?.vehicleType === v.vehicleType && {
                                backgroundColor: 'green',
                                borderWidth: 2,
                            },
                        ]}
                    >
                        <View style={styles.rowBetween}>
                            <Text style={styles.vehicleName}>{v.vehicleType}</Text>
                            <Text style={styles.price}>
                                ₹ {v.estimatedFare ?? '—'}
                            </Text>

                        </View>

                        <Text style={styles.address}>
                            {distanceKm} km · {v.etaMin} min away
                        </Text>

                        <AppButton
                            title={
                                selectedVehicle?.vehicleType === v.vehicleType
                                    ? 'Selected'
                                    : 'Select'
                            }
                            onPress={() => setSelectedVehicle(v)}
                        />
                    </RideCard>
                ))}



                <View style={styles.content}>
                    <AppButton title="Book Ride"
                        onPress={handleConfirmBooking}
                    // onPress={() => navigation.navigate('Booking4')}
                    />
                </View>





            </ScrollView>
            <BottomTabs />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    infoBlock: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 16,
    },

    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    price: {
        fontWeight: '600',
        color: COLORS.black,
    },


    rideCard: {
        backgroundColor: 'rgba(232, 232, 232, 1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        marginHorizontal: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
    },


    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    vehicleName: {
        fontSize: 14,
        fontWeight: 700,
        // color:'white'

    },

    address: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,

    },

    button: {
        backgroundColor: '#33ea85ff',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
    },


    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
