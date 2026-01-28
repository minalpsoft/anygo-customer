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
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Booking3({ route, navigation }) {
    const {
        pickup,
        drop,
        distanceKm,
        durationMin,
        tripType,
        receiverName,
  receiverMobile,
    } = route.params;

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // const API_BASE_URL = 'http://10.197.26.200:5000/';

    useEffect(() => {
        getEstimate();
    }, []);


    const getEstimate = async () => {
        try {
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
                    receiverName: receiverName || undefined,
                    receiverMobile: receiverMobile || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'CITY_NOT_SUPPORTED') {
                    Alert.alert(
                        'Service Not Available',
                        'Service is not available in this city'
                    );
                } else if (data.code === 'NO_DRIVERS') {
                    Alert.alert(
                        'No Drivers Nearby',
                        'Currently no drivers are available near your pickup location'
                    );
                } else {
                    Alert.alert('Error', data.message || 'Something went wrong');
                }
                return;
            }

            setVehicles(data.vehicles);
        } catch (err) {
            Alert.alert('Error', 'Failed to fetch vehicles');
        }
    };

    //     const handleConfirmBooking = async () => {
    //         if (!selectedVehicle) {
    //             Alert.alert('Error', 'Please select a vehicle');
    //             return;
    //         }

    //         const token = await AsyncStorage.getItem('token');

    //         const res = await fetch(`${API_BASE_URL}booking/create`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 vehicleType: selectedVehicle.vehicleType,
    //                 pickupLat: pickup.lat,
    //                 pickupLng: pickup.lng,
    //                 dropLat: drop.lat,
    //                 dropLng: drop.lng,
    //             }),
    //         });

    //         const data = await res.json();

    //         // navigation.replace('SearchingDriver', {
    //         //     bookingId: data.bookingId || data._id,
    //         //     vehicleType: selectedVehicle.vehicleType,
    //         //     estimatedFare: selectedVehicle.estimatedFare,
    //         //     distanceKm,
    //         //     durationMin,
    //         // });

    //        navigation.replace('Booking4', {
    //   bookingId: data.bookingId || data._id,

    //   // dynamic values for UI
    //   vehicleType: selectedVehicle.vehicleType,
    //   estimatedFare: selectedVehicle.estimatedFare,
    //   distanceKm,
    //   durationMin,
    // });

    //     };


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
                            {distanceKm} km  •  Driver {v.etaMin} mins away

                        </Text>

                        <AppButton
                            title={
                                selectedVehicle?.vehicleType === v.vehicleType
                                    ? 'Selected'
                                    : 'Select'
                            }
                            onPress={() => setSelectedVehicle(v)}
                            style={{
                                backgroundColor:
                                    selectedVehicle?.vehicleType === v.vehicleType
                                        ? 'green'
                                        : COLORS.primary,
                            }}
                        />

                    </RideCard>
                ))}



                <View style={styles.content}>
                    {/* <AppButton title="Book Ride"
                        onPress={handleConfirmBooking}
                    // onPress={() => navigation.navigate('Booking4')}
                    /> */}

                    <AppButton
                        title="Next"
                        onPress={() => {
                            if (!selectedVehicle) {
                                Alert.alert('Error', 'Please select a vehicle');
                                return;
                            }

                            navigation.replace('Booking4', {
                                vehicleType: selectedVehicle.vehicleType,
                                baseFare: selectedVehicle.estimatedFare,
                                distanceKm,
                                durationMin,
                                isLoadingAvailable: selectedVehicle.isLoadingAvailable,
                                loadingChargePerLabour: selectedVehicle.loadingChargePerLabour,
                                pickup,
                                drop,
                            });

                        }}
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
