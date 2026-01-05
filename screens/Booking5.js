import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppSearch from '../components/AppSearch';
import MapView, { Marker } from 'react-native-maps';
import RideCard from '../components/Card';
import Divider from '../components/Divider';
import { Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function Booking5({ navigation }) {
    const [driverLocation, setDriverLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);

    const API_BASE_URL = 'http://192.168.31.89:3000/';
 useEffect(() => {
        fetchCurrentTrip();

        const interval = setInterval(fetchCurrentTrip, 5000); // every 5 sec
        return () => clearInterval(interval);
    }, []);

    const fetchCurrentTrip = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(
                `${API_BASE_URL}booking/current/status`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) return;

            setDriverLocation(data.driverLocation);
            setPickupLocation(data.pickupLocation);
            setDropLocation(data.dropLocation);
        } catch (err) {
            console.log('LIVE TRIP ERROR', err);
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* RIDE CARD */}
                <RideCard>
                    <View style={styles.driverRow}>
                        <View style={styles.driverAvatar}>
                            <Image
                                source={require('../assets/driver.png')}
                                style={styles.driverImage}
                            />
                        </View>
                        <View>
                            <Text style={styles.driverName}>Driver Name</Text>
                            <Text style={styles.address}>Pickup Address</Text>
                            <Text style={styles.address}>Drop Address</Text>
                        </View>


                    </View>

                    <View style={styles.arrivalRow}>
                        <Text style={styles.address}>Arriving in 2 min</Text>

                        <TouchableOpacity style={styles.navBtn}>
                            <Text style={styles.navText} onPress={() => navigation.navigate('CurrentTrip')}>Navigation</Text>
                        </TouchableOpacity>
                    </View>


                    <Divider />

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>02:30 Min</Text>
                            <Text style={styles.statLabel}>Duration</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>Rs. 3240</Text>
                            <Text style={styles.statLabel}>Fare</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>34 km</Text>
                            <Text style={styles.statLabel}>Distance</Text>
                        </View>
                    </View>
                </RideCard>

                <View style={styles.mapBox}>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFillObject}
                            region={{
                                latitude: driverLocation?.lat || 19.0760,
                                longitude: driverLocation?.lng || 72.8777,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            {/* DRIVER MARKER */}
                            {driverLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: driverLocation.lat,
                                        longitude: driverLocation.lng,
                                    }}
                                    title="Driver"
                                    pinColor="green"
                                />
                            )}

                            {/* PICKUP MARKER */}
                            {pickupLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: pickupLocation.lat,
                                        longitude: pickupLocation.lng,
                                    }}
                                    title="Pickup"
                                    pinColor="blue"
                                />
                            )}

                            {/* DROP MARKER */}
                            {dropLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: dropLocation.lat,
                                        longitude: dropLocation.lng,
                                    }}
                                    title="Drop"
                                    pinColor="red"
                                />
                            )}

                            {/* ROUTE LINE */}
                            {driverLocation && pickupLocation && (
                                <Polyline
                                    coordinates={[
                                        {
                                            latitude: driverLocation.lat,
                                            longitude: driverLocation.lng,
                                        },
                                        {
                                            latitude: pickupLocation.lat,
                                            longitude: pickupLocation.lng,
                                        },
                                        {
                                            latitude: dropLocation.lat,
                                            longitude: dropLocation.lng,
                                        },
                                    ]}
                                    strokeWidth={4}
                                    strokeColor="blue"
                                />
                            )}
                        </MapView>

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
        height: 500,
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
