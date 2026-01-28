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
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Booking4({ route, navigation }) {
    // const { amount } = route.params;
    const amount = route?.params?.amount ?? 0;
    const bookingId = route?.params?.bookingId;


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

    const resolvedBooking = booking ?? {
        vehicleType: selectedVehicle,
        estimatedFare: selectedFare,
        distanceKm: selectedDistance,
        durationMin: selectedDuration,
        loadingCharge: 0,
        discount: 0,
    };

    const finalBaseFare =
        booking?.finalFare ??
        booking?.estimatedFare ??
        selectedFare ??
        0;

    const finalLabourCharge =
        booking?.loadingCharge ?? 0;

    const finalDiscount =
        booking?.discount ?? 0;

    const finalPayableAmount =
        booking?.finalFare ??
        finalBaseFare + finalLabourCharge - finalDiscount;


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

            const res = await fetch(`${API_BASE_URL}booking/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            // ✅ NO ACTIVE BOOKING → just clear state, NO alert
            if (res.status === 404 || data?.message === 'No active booking found') {
                setBooking(null);
                return;
            }

            if (!res.ok) {
                throw data;
            }

            setBooking(data);
        } catch (err) {
            // ❌ show alert only for real errors
            Alert.alert(
                'Error',
                err?.message || 'Something went wrong. Please try again.'
            );
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
                {resolvedBooking && (
                    <RideCard>
                        <View style={styles.rowBetween}>
                            <Text style={styles.vehicleName}>
                                {resolvedBooking.vehicleType}
                            </Text>

                            <Text style={styles.price}>
                                ₹ {resolvedBooking.estimatedFare}
                            </Text>
                        </View>

                        <Text style={styles.address}>
                            {resolvedBooking.distanceKm ?? 0} Km
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
                            enabled={accepted}
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
                {/* {booking && ( */}
                <View style={styles.rideCard}>
                    <View style={styles.rowBetween}>
                        <Text>Trip fare</Text>
                        <Text>₹ {finalBaseFare}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Loading / Unloading</Text>
                        <Text>₹ {finalLabourCharge}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Discount</Text>
                        <Text>₹ {finalDiscount}</Text>
                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text style={{ fontWeight: 'bold' }}>Payable Amount</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            ₹ {finalPayableAmount}
                        </Text>
                    </View>
                </View>
                {/* )} */}


                <View style={styles.content}>
                    {/* <AppButton title="Next" onPress={() => navigation.navigate('PaymentOptions')} /> */}
                    <AppButton
                        title="Next"
                        onPress={() =>
                            navigation.navigate('PaymentOptions', {
                                // amount: payableAmount,
                                amount: finalPayableAmount,
                                bookingId,
                            })
                        }
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
