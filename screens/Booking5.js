import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import MapView, { Marker } from 'react-native-maps';
import RideCard from '../components/Card';
import Divider from '../components/Divider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { Alert } from 'react-native';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
import { useIsFocused } from '@react-navigation/native';
import { AnimatedRegion } from 'react-native-maps';

export default function Booking5({ route, navigation }) {
    const [driverLocation, setDriverLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);
    const [tripStatus, setTripStatus] = useState(null);
    const [trip, setTrip] = useState(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const pollingRef = useRef(null);
    const isFocused = useIsFocused();
    const [finalAmount, setFinalAmount] = useState(null);
    const [mapReady, setMapReady] = useState(false);

    const {
        bookingId,
        vehicleType,
        estimatedFare,
        distanceKm,
        durationMin,
    } = route.params;

    const driverAnim = useRef(
        new AnimatedRegion({
            latitude: pickupLocation?.latitude || 19.0760,
            longitude: pickupLocation?.longitude || 72.8777,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    ).current;

    useEffect(() => {
        if (!driverLocation && pickupLocation) {
            setDriverLocation({
                latitude: pickupLocation.latitude + 0.0001, // tiny offset
                longitude: pickupLocation.longitude + 0.0001,
            });
        }
    }, [driverLocation, pickupLocation]);

    useEffect(() => {
        if (!mapRef.current) return;

        const coords = [];

        if (driverLocation) coords.push(driverLocation);
        if (pickupLocation) coords.push(pickupLocation);
        if (dropLocation) coords.push(dropLocation);

        if (coords.length >= 2) {
            mapRef.current.fitToCoordinates(coords, {
                edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
                animated: true,
            });
        }
    }, [driverLocation, pickupLocation, dropLocation]);


    // const routePoints = React.useMemo(() => {
    //     // DRIVER → PICKUP (until trip actually starts)
    //     if (
    //         driverLocation &&
    //         pickupLocation &&
    //         tripStatus !== 'TRIP_STARTED' &&
    //         tripStatus !== 'TRIP_COMPLETED'
    //     ) {
    //         return { origin: driverLocation, destination: pickupLocation };
    //     }

    //     // PICKUP → DROP
    //     if (
    //         tripStatus === 'TRIP_STARTED' &&
    //         pickupLocation &&
    //         dropLocation
    //     ) {
    //         return { origin: pickupLocation, destination: dropLocation };
    //     }

    //     return null;
    // }, [driverLocation, pickupLocation, dropLocation, tripStatus]);

    const routePoints = React.useMemo(() => {
        if (!pickupLocation) return null;

        // DRIVER → PICKUP
        if (
            tripStatus === 'DRIVER_ASSIGNED'
        ) {
            return {
                origin: driverLocation || pickupLocation, // fallback to pickup
                destination: pickupLocation,
            };
        }

        // PICKUP → DROP
        if (tripStatus === 'TRIP_STARTED' && dropLocation) {
            return {
                origin: pickupLocation,
                destination: dropLocation,
            };
        }

        return null;
    }, [tripStatus, driverLocation, pickupLocation, dropLocation]);


    useEffect(() => {
        fetchCurrentTrip();

        pollingRef.current = setInterval(fetchCurrentTrip, 5000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, []);

    const fetchCurrentTrip = async () => {
        try {
            console.log('📡 fetchCurrentTrip called');

            const token = await AsyncStorage.getItem('token');

            const res = await fetch(`${API_BASE_URL}booking/current`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            // if (!res.ok || !data) return;
            if (!data || !data.status) {
                setTripStatus('TRIP_COMPLETED');
                return;
            }

            // console.log('LIVE TRIP DATA FULL', data);
            // console.log('📦 backend status:', data.status);
            // console.log('💰 backend finalFare:', data.finalFare);
            // console.log('🚦 frontend finalAmount:', finalAmount);
            // ✅ STATUS
            setTripStatus(data.status);
            setTrip(data);

            // ✅ ADD THIS BLOCK RIGHT HERE 👇👇👇
            if (data.finalFare !== undefined && data.finalFare !== null) {
                setFinalAmount(Number(data.finalFare));
            }

            // ✅ DRIVER LOCATION
            // ✅ DRIVER LOCATION (LIVE)
            if (
                data.lastDriverLocation &&
                typeof data.lastDriverLocation.lat === 'number' &&
                typeof data.lastDriverLocation.lng === 'number'
            ) {
                setDriverLocation({
                    latitude: data.lastDriverLocation.lat,
                    longitude: data.lastDriverLocation.lng,
                });
            }
            else if (
                data.driver?.currentLocation?.coordinates?.length === 2
            ) {
                const [lng, lat] = data.driver.currentLocation.coordinates;

                setDriverLocation({
                    latitude: lat,
                    longitude: lng,
                });
            }


            // ✅ PICKUP & DROP
            if (data.pickupLocation?.lat && data.pickupLocation?.lng) {
                setPickupLocation({
                    latitude: Number(data.pickupLocation.lat),
                    longitude: Number(data.pickupLocation.lng),
                });
            }

            if (data.dropLocation?.lat && data.dropLocation?.lng) {
                setDropLocation({
                    latitude: Number(data.dropLocation.lat),
                    longitude: Number(data.dropLocation.lng),
                });
            }


        } catch (err) {
            console.log('LIVE TRIP ERROR', err);
        }
    };

    useEffect(() => {
        if (!driverLocation) return;

        driverAnim.timing({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            duration: 3000,
            useNativeDriver: false,
        }).start();
    }, [driverLocation]);


    useEffect(() => {
        if (!driverLocation || !mapRef.current) return;

        mapRef.current.animateCamera(
            {
                center: driverLocation,
                zoom: 17,
            },
            { duration: 1000 }
        );
    }, [driverLocation]);


    useEffect(() => {
        if (!mapRef.current || !routePoints) return;

        mapRef.current.fitToCoordinates(
            [routePoints.origin, routePoints.destination],
            {
                edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
                animated: true,
            }
        );
    }, [routePoints]);


    const hasNavigated = useRef(false);

    useEffect(() => {
        if (
            isFocused &&
            tripStatus === 'TRIP_COMPLETED' &&
            !hasNavigated.current
        ) {
            hasNavigated.current = true;

            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }

            setTimeout(() => {
                Alert.alert(
                    '🎉 Destination Reached',
                    'You have successfully reached your destination.',
                    [
                        {
                            text: 'Proceed to Payment',
                            onPress: () =>
                                navigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: 'PaymentOptions',
                                            params: {
                                                bookingId,
                                                vehicleType: trip?.vehicleType ?? vehicleType,
                                                finalPayableAmount: finalAmount,
                                                distanceKm: trip?.distanceKm ?? distanceKm,
                                                durationMin: trip?.durationMin ?? durationMin,
                                            },
                                        },
                                    ],
                                }),
                        }

                    ],
                    { cancelable: false }
                );
            }, 10);

        }
    }, [tripStatus, isFocused]);


    useEffect(() => {
        console.log('🔥 CURRENT tripStatus:', tripStatus);
    }, [tripStatus]);

    console.log('ROUTE:', routePoints);
    console.log('DRIVER:', driverLocation);
    console.log('PICKUP:', pickupLocation);
    console.log('DROP:', dropLocation);
    console.log('STATUS:', tripStatus);
    console.log('GOOGLE KEY:', GOOGLE_API_KEY);


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />


                {tripStatus === 'SEARCHING_DRIVER' && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16 }}>
                            🔍 Looking for nearby driver...
                        </Text>
                    </View>
                )}


                <View style={styles.mapBox}>
                    <View style={styles.mapContainer}>
                        <View style={{ padding: 12, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>
                                {tripStatus === 'SEARCHING_DRIVER' && '🔍 Searching for driver'}
                                {tripStatus === 'DRIVER_ASSIGNED' && '🚗 Driver is on the way'}
                                {tripStatus === 'TRIP_STARTED' && '🛣 Trip in progress'}
                            </Text>
                        </View>

                        {tripStatus !== 'TRIP_COMPLETED' && (
                            <MapView
                                ref={mapRef}
                                style={StyleSheet.absoluteFillObject}
                                onMapReady={() => setMapReady(true)}
                                initialRegion={{
                                    latitude: pickupLocation?.latitude || 19.0760,
                                    longitude: pickupLocation?.longitude || 72.8777,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                }}
                            >


                                {/* ROUTE */}
                                {mapReady && routePoints && (
                                    <MapViewDirections
                                        key={`${routePoints.origin.latitude}-${routePoints.destination.latitude}`}
                                        origin={routePoints.origin}
                                        destination={routePoints.destination}
                                        apikey={GOOGLE_API_KEY}
                                        mode="DRIVING"
                                        region="IN"
                                        strokeWidth={5}
                                        strokeColor="#1E90FF"
                                        onError={(e) => console.log('❌ DIRECTIONS ERROR:', e)}
                                    />

                                )}

                                {/* DRIVER */}
                                {driverLocation && (
                                    <Marker.Animated coordinate={driverAnim} anchor={{ x: 0.5, y: 0.5 }}>
                                        <Image
                                            source={require('../assets/carimg1.png')}
                                            style={{ width: 40, height: 40 }}
                                        />
                                    </Marker.Animated>
                                )}


                                {/* PICKUP */}
                                {pickupLocation && (
                                    <Marker
                                        coordinate={pickupLocation}
                                        pinColor="red"
                                        title="Pickup"
                                    />
                                )}

                                {/* DROP */}
                                {dropLocation && (
                                    <Marker
                                        coordinate={dropLocation}
                                        pinColor="green"
                                        title="Drop"
                                    />
                                )}


                            </MapView>
                        )}

                    </View>
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

    mapBox: {
        height: 700,
        backgroundColor: '#E0E0E0',
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        overflow: 'hidden',
    },

    mapContainer: {
        flex: 1,
    },

    vehicleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginHorizontal: 16,
    },

    vehicleBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        overflow: 'hidden',
    },

    imageWrapper: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },

    vehicleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    vehicleText: {
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
    offerBox: {
        height: 170,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 16,
        elevation: 3,
    },


    rideCard: {
        backgroundColor: 'rgba(232, 232, 232, 1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
    },


    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 22,
        overflow: 'hidden',
        // backgroundColor: '#DDD',
        marginRight: 12,
    },

    driverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    driverName: {
        fontWeight: '700',
        fontSize: 14,
        marginTop: 8,
    },

    address: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,
    },

    navBtn: {
        marginLeft: 'auto',
        backgroundColor: '#FF1E1E',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    navText: {
        fontSize: 12,
        fontWeight: '600',
        color: "white"
    },
    arrivalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    stat: {
        alignItems: 'center',
    },

    statValue: {
        fontWeight: '700',
        fontSize: 14,
    },

    statLabel: {
        fontSize: 11,
        color: COLORS.gray,
        marginTop: 2,
    },

    divider: {
        height: 2,
        backgroundColor: 'rgba(167, 167, 167, 0.6)',
        marginVertical: 5,
        marginLeft: -17,
        marginRight: -17,
        marginTop: 10
    },

});
