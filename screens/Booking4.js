import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity, Image, Alert, ActivityIndicator
} from 'react-native';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import RideCard from '../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Divider from '../components/Divider';

export default function Booking4({ route, navigation }) {
    const bookingId  = route?.params?.bookingId;
    // const route = useRoute();
    const selectedVehicle = route.params?.vehicleType;
    const selectedFare = route.params?.estimatedFare;
    const selectedDistance = route?.params?.distanceKm;
    const selectedDuration = route?.params?.durationMin;
    const [accepted, setAccepted] = useState(false);
    const [labourCount, setLabourCount] = useState(1);
    const [coupon, setCoupon] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    // const baseFare = Number(
    //     booking?.finalFare || booking?.estimatedFare || 0
    // );
    const baseFare = Number(
  booking?.finalFare ??
  booking?.estimatedFare ??
  selectedFare ??
  0
);

    const labourCharge = accepted ? labourCount * 200 : 0;
    const discount = coupon ? 20 : 0;
    const payableAmount = baseFare + labourCharge - discount;
    const API_BASE_URL = 'http://192.168.31.89:3000/';

    useEffect(() => {
        if (!bookingId) {
            setLoading(false);
            return;
        }
        fetchBooking();
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(
                `${API_BASE_URL}booking/${bookingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) throw data;

            setBooking(data);
        } catch (err) {
            Alert.alert('Error', err?.message || 'Failed to load booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
                <Text style={styles.loadingText}>Loading booking...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* RIDE CARD */}
                {(booking?.vehicleType || selectedVehicle) && (
                    <RideCard>
                        <View style={styles.rowBetween}>
                            <Text style={styles.vehicleName}>
                                {booking?.vehicleType ?? selectedVehicle}
                            </Text>

                            <Text style={styles.price}>
                                ₹ {Number(
                                    booking?.finalFare ??
                                    booking?.estimatedFare ??
                                    selectedFare ??
                                    0
                                )}
                            </Text>
                        </View>

                        <Text style={styles.address}>
                            {booking?.distanceKm ?? selectedDistance ?? 0} Km ·
                            {booking?.durationMin ?? selectedDuration ?? 0} Min away
                        </Text>

                    </RideCard>
                )}

                <View style={styles.content}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.checkboxContainer}
                        onPress={() => setAccepted(!accepted)}
                    >
                        <Checkbox
                            value={accepted}
                            onValueChange={setAccepted}
                            color={accepted ? COLORS.primary : undefined}
                        />

                        <Text style={styles.termsText}>
                            Loading / Unloading required
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* labour */}
                <View style={styles.content}>
                    <Text style={styles.sectionLabel}>Number of Labour</Text>

                    <View style={styles.dropdownBox}>
                        <Picker
                            selectedValue={labourCount}
                            onValueChange={(itemValue) => setLabourCount(itemValue)}
                        >
                            <Picker.Item label="1 Labour" value={1} />
                            <Picker.Item label="2 Labour" value={2} />
                            <Picker.Item label="3 Labour" value={3} />
                            <Picker.Item label="4 Labour" value={4} />
                        </Picker>
                    </View>
                </View>

                {/* coupon */}
                <View style={styles.content}>
                    {/* <Text style={styles.sectionLabel}>Apply Coupon</Text> */}

                    <View style={styles.couponRow}>
                        <TextInput
                            value={coupon}
                            onChangeText={setCoupon}
                            placeholder="Enter coupon code"
                            style={styles.couponInput}
                        />

                        <TouchableOpacity style={styles.applyBtn}>
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* final bill */}
                {baseFare > 0 && (
                    <View style={styles.rideCard}>
                        <View style={styles.rowBetween}>
                            <Text>Trip fare</Text>
                            <Text>₹ {baseFare}</Text>
                        </View>

                        <View style={styles.rowBetween}>
                            <Text>Loading / Unloading</Text>
                            <Text>₹ {labourCharge}</Text>
                        </View>

                        <View style={styles.rowBetween}>
                            <Text>Discount</Text>
                            <Text>₹ {discount}</Text>
                        </View>

                        <Divider />

                        <View style={styles.rowBetween}>
                            <Text style={{ fontWeight: 'bold' }}>Payable Amount</Text>
                            <Text style={{ fontWeight: 'bold' }}>₹ {payableAmount}</Text>
                        </View>
                    </View>
               )}

                <View style={styles.content}>
                    <AppButton title="Next" onPress={() => navigation.navigate('Booking5')}  />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#555',
    },

    content: {
        paddingHorizontal: 20,
    },

    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalRow: {
        marginTop: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#DDD',
    },

    price: {
        fontSize: 15,
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
        fontWeight: 700

    },

    label: {
        fontSize: 15,
        color: COLORS.gray,
        marginTop: 8
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,

    },

    termsText: {
        fontSize: 14,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },

    dropdownBox: {
        backgroundColor: '#EEE',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
    },

    couponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    couponInput: {
        flex: 1,
        height: 46,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#DDD',
    },

    applyBtn: {
        marginLeft: 10,
        height: 42,
        paddingHorizontal: 18,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    applyText: {
        color: '#FFF',
        fontWeight: '600',
    },


});
