import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppSearch from '../components/AppSearch';
import MapView, { Marker } from 'react-native-maps';
import RideCard from '../components/Card';
import Divider from '../components/Divider';
import { useState, useEffect } from 'react';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export default function Dashboard({ navigation }) {

    const vehicles = [
        { name: 'Truck', image: require('../assets/truck.png') },
        { name: 'Tempo', image: require('../assets/tempo.png') },
        { name: 'Bike', image: require('../assets/bike.png') },
        { name: 'Cab', image: require('../assets/car.png') },
    ];

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState({});

    const requestLocationPermission = async () => {
        const askedBefore = await AsyncStorage.getItem('locationAsked');

        if (askedBefore) return; // 🔥 already asked once

        const { status } = await Location.requestForegroundPermissionsAsync();

        await AsyncStorage.setItem('locationAsked', 'true');

        if (status !== 'granted') {
            Alert.alert(
                'Location Required',
                'Location access is required to book rides.'
            );
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        fetchTripHistory();
    }, []);

    const fetchTripHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(`${API_BASE_URL}customer/trips/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setTrips(data);

            const addrMap = {};

            for (const trip of data) {
                if (trip.pickupLocation?.lat && trip.pickupLocation?.lng) {

                    addrMap[`${trip._id}-pickup`] = await getAddressFromLatLng(
                        trip.pickupLocation.lat,
                        trip.pickupLocation.lng
                    );
                }

                if (trip.dropLocation?.lat && trip.dropLocation?.lng) {

                    addrMap[`${trip._id}-drop`] = await getAddressFromLatLng(
                        trip.dropLocation.lat,
                        trip.dropLocation.lng
                    );
                }

            }
            setAddresses(addrMap);

        } catch (err) {
            // console.log('TRIP HISTORY ERROR', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });



    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // const getAddressFromLatLng = async (lat, lng) => {
    //     try {
    //         const res = await fetch(
    //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    //         );
    //         const data = await res.json();

    //         if (data.results?.length > 0) {
    //             return data.results[0].formatted_address;
    //         }

    //         return 'Address not found';
    //     } catch (error) {
    //         console.log('GEOCODE ERROR', error);
    //         return 'Address not available';
    //     }
    // };

    const getAddressFromLatLng = async (lat, lng) => {
        if (lat == null || lng == null) {
            return 'Location unavailable';
        }

        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
            );
            const data = await res.json();

            if (data.results?.length > 0) {
                return data.results[0].formatted_address;
            }

            return 'Address not found';
        } catch (error) {
            console.log('GEOCODE ERROR', error);
            return 'Address not available';
        }
    };

    const formatDuration = (min) => {
        if (!min) return '--';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return h ? `${h}h ${m}m` : `${m} min`;
    };

    const latestTrip =
        trips.length > 0
            ? [...trips]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .at(-1)
            : null;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* SEARCH DESIGN */}
                <TouchableOpacity
                    style={styles.searchBox}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Booking1')}
                >
                    <Ionicons name="search" size={20} color="#777" />
                    <Text style={styles.searchText}>Search Destination</Text>
                </TouchableOpacity>

                <View style={styles.mapBox}>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFillObject}
                            initialRegion={{
                                latitude: 19.0760,
                                longitude: 72.8777,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        />
                    </View>
                </View>


                {/* VEHICLE TYPES */}
                <View style={styles.vehicleRow}>
                    {vehicles.map((item) => (
                        <TouchableOpacity key={item.name} style={styles.vehicleBtn}>
                            <View style={styles.imageWrapper}>
                                <Image source={item.image} style={styles.vehicleImage} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>


                {/* OFFER BANNER */}
                <View style={styles.offerBox}>
                    <Image
                        source={require('../assets/specialoffer.webp')} // your image path
                        style={styles.offerImage}
                        resizeMode="cover"
                    />
                </View>


                {latestTrip && (
                    <RideCard key={latestTrip._id}>

                        {/* DATE */}
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {formatDate(
                                    latestTrip.tripEndTime || latestTrip.tripStartTime
                                )}
                            </Text>
                        </View>

                        {/* DRIVER */}
                        <View style={styles.driverRow}>
                            <View style={styles.driverAvatar}>
                                <Image
                                    source={require('../assets/driver.png')}
                                    style={styles.driverImage}
                                />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.driverName} numberOfLines={1}>
                                    {latestTrip.driverName || 'Driver'}
                                </Text>

                                <Text
                                    style={styles.address}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    📍 {addresses[`${latestTrip._id}-pickup`] || 'Loading pickup address...'}
                                </Text>

                                <Text
                                    style={styles.address}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    🏁 {addresses[`${latestTrip._id}-drop`] || 'Loading drop address...'}
                                </Text>
                            </View>
                        </View>

                        {/* STATUS */}
                        <View style={styles.arrivalRow}>
                            <Text style={styles.address}>
                                {latestTrip.status === 'TRIP_COMPLETED'
                                    ? 'Trip completed'
                                    : 'Trip in progress'}
                            </Text>

                            <TouchableOpacity
                                style={styles.navBtn}
                                onPress={() =>
                                    navigation.navigate(
                                        latestTrip.status === 'TRIP_COMPLETED'
                                            ? 'TripDetails'
                                            : 'CurrentTrip',
                                        { bookingId: latestTrip._id }
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.navText,
                                        {
                                            color:
                                                latestTrip.status === 'TRIP_COMPLETED'
                                                    ? COLORS.text
                                                    : 'green',
                                        },
                                    ]}
                                >
                                    {latestTrip.status === 'TRIP_COMPLETED'
                                        ? 'Completed'
                                        : 'On Going'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Divider />

                        {/* STATS */}
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {formatDuration(
                                        latestTrip.actualDurationMin || latestTrip.durationMin
                                    )}
                                </Text>
                                <Text style={styles.statLabel}>Duration</Text>
                            </View>

                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    ₹ {latestTrip.finalFare || latestTrip.payableAmount || 0}
                                </Text>
                                <Text style={styles.statLabel}>Fare</Text>
                            </View>

                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {latestTrip.actualDistanceKm || latestTrip.distanceKm} km
                                </Text>
                                <Text style={styles.statLabel}>Distance</Text>
                            </View>
                        </View>

                    </RideCard>
                )}



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
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },

    statusText: {
        fontSize: 11,
    },
    driverRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',          // 🔥 CRITICAL
    },

    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        overflow: 'hidden',
        flexShrink: 0,          // 🔥 prevents image shrinking
    },

    textContainer: {
        flex: 1,                // 🔥 MOST IMPORTANT
        minWidth: 0,            // 🔥 REQUIRED for text wrapping
    },

    driverName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },

    address: {
        fontSize: 12,
        color: COLORS.gray,
        lineHeight: 16,
        width: '80%'
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 15
    },
    searchText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#777',
    },

    mapBox: {
        height: 160,
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
    offerImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center"
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

    // driverName: {
    //     fontWeight: '700',
    //     fontSize: 14,
    //     marginTop: 8,
    // },

    // address: {
    //     fontSize: 12,
    //     color: COLORS.gray,
    //     marginTop: 8,

    // },
    arrivalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    navBtn: {
        marginLeft: 'auto',
        backgroundColor: '#FF1E1E',
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 20,
    },

    navText: {
        fontSize: 12,
        fontWeight: '600',
        color: "white"
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
        // color: COLORS.gray,
        marginTop: 2,

    },

    divider: {
        height: 1,
        backgroundColor: 'white',
        marginVertical: 5,
        marginLeft: -16,
        marginRight: -16,
        marginTop: 10
    },

});
