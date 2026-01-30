import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import RideCard from '../components/Card';
import Divider from '../components/Divider';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
// import { getAddressFromLatLng } from '../services/customerAuth';

// const API_BASE_URL = 'http://10.197.26.200:5000/';

export default function TripHistory({ navigation }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState({});

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
            console.log('TRIP HISTORY RESPONSE:', data);
            setTrips(data);

            const addrMap = {};

            for (const trip of data) {
                if (trip.pickupLocation) {
                    addrMap[`${trip._id}-pickup`] = await getAddressFromLatLng(
                        trip.pickupLocation.lat,
                        trip.pickupLocation.lng
                    );
                }

                if (trip.dropLocation) {
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


    const formatDuration = (min) => {
        if (!min) return '--';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return h ? `${h}h ${m}m` : `${m} min`;
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppHeader />

                {trips.length === 0 && (
                    <Text style={styles.emptyText}>No trips found</Text>
                )}

                {trips.map((trip) => (
                    <RideCard key={trip._id}>
                        {/* DATE */}
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {formatDate(trip.tripEndTime || trip.tripStartTime)}
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
                                    {trip.driverName || 'Driver'}
                                </Text>

                                <Text
                                    style={styles.address}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    📍 {addresses[`${trip._id}-pickup`] || 'Loading pickup address...'}
                                </Text>

                                <Text
                                    style={styles.address}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    🏁 {addresses[`${trip._id}-drop`] || 'Loading drop address...'}
                                </Text>
                            </View>
                        </View>


                        {/* STATUS */}
                        <View style={styles.arrivalRow}>
                            <Text style={styles.address}>
                                {trip.status === 'TRIP_COMPLETED'
                                    ? 'Trip completed'
                                    : 'Trip in progress'}
                            </Text>

                            <TouchableOpacity
                                style={styles.navBtn}
                                onPress={() =>
                                    navigation.navigate(
                                        trip.status === 'TRIP_COMPLETED'
                                            ? 'TripDetails'
                                            : 'CurrentTrip',
                                        { bookingId: trip._id }
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.navText,
                                        {
                                            color:
                                                trip.status === 'TRIP_COMPLETED'
                                                    ? COLORS.text
                                                    : 'green',
                                        },
                                    ]}
                                >
                                    {trip.status === 'TRIP_COMPLETED'
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
                                    {formatDuration(trip.actualDurationMin || trip.durationMin)}
                                </Text>
                                <Text style={styles.statLabel}>Duration</Text>
                            </View>

                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    ₹ {trip.finalFare || trip.payableAmount || 0}
                                </Text>
                                <Text style={styles.statLabel}>Fare</Text>
                            </View>

                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {trip.actualDistanceKm || trip.distanceKm} km
                                </Text>
                                <Text style={styles.statLabel}>Distance</Text>
                            </View>
                        </View>
                    </RideCard>
                ))}

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

    navBtn: {
        marginLeft: 'auto',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 20,
    },

    navText: {
        fontSize: 12,
        fontWeight: '600',
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
        height: 1,
        backgroundColor: 'white',
        marginVertical: 5,
        marginLeft: -16,
        marginRight: -16,
        marginTop: 10
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


});
