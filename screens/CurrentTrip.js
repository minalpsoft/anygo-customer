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
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import Booking3 from './Booking3';
import RideCard from '../components/Card';
import Divider from '../components/Divider';
import { Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CurrentTrip({ navigation }) {

    const [driverLocation, setDriverLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);

    // const API_BASE_URL = 'http://10.197.26.200:5000/';

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


                {/* driver card */}
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

                    {/* <View style={styles.arrivalRow}> */}

                    <TouchableOpacity style={styles.navWrapper}>
                        <Text style={styles.navText} onPress={() => navigation.navigate('CurrentTrip')}>Reached by 10:00 AM</Text>
                    </TouchableOpacity>
                    {/* </View> */}


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

                <View style={styles.completeContainer}>
                    <View style={styles.tickCircle}>
                        <Ionicons name="checkmark" size={48} color="#fff" />
                    </View>

                    <Text style={styles.completeTitle}>Trip Completed</Text>
                    <Text style={styles.completeSubtitle}>
                        Your trip has been completed successfully!
                    </Text>
                </View>


                <View style={styles.content}>
                    <View style={styles.content1}>

                        <AppButton title="Make Payment" onPress={() => navigation.navigate('PaymentOptions')} />
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


    content: {
        paddingHorizontal: 16,
    },
    content1: {
        marginTop: "15"
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
    placeholder: {
        alignItems: "center",
        justifyContent: "center"
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
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    navWrapper: {
        alignSelf: 'flex-end',
    },

    navText: {
        fontSize: 14,
        // fontWeight: '600',
        // color:'white'
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

    completeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
    },

    tickCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#2ECC71', // green success color
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4,
    },

    completeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        marginBottom: 6,
    },

    completeSubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
    },


});
