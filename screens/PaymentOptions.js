import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import Divider from '../components/Divider';
import RideCard from '../components/Card';
import { useEffect } from 'react';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentOptions({ route }) {
    const navigation = useNavigation();

    const bookingId = route?.params?.bookingId ?? null;
    const vehicleType = route?.params?.vehicleType;
    const estimatedFare = route?.params?.estimatedFare;

    // const finalFare = Number(route?.params?.finalPayableAmount ?? 0);

    const distanceKm = route?.params?.distanceKm;
    const durationMin = route?.params?.durationMin;

    const [paymentMethod, setPaymentMethod] = useState(null);

    const PaymentItem = ({ value, title, subtitle, icon }) => (
        <TouchableOpacity
            style={[
                styles.card,
                paymentMethod === value && styles.selectedCard,
            ]}
            onPress={() => setPaymentMethod(value)}
            activeOpacity={0.8}
        >
            <View style={styles.left}>
                <Ionicons name={icon} size={26} color={COLORS.primary} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.radioOuter}>
                {paymentMethod === value && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );

    const [finalFare, setFinalFare] = useState(0);

    useEffect(() => {
    const fetchFinalFare = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // ✅ get token

            if (!token) {
                console.log('❌ No token found');
                return;
            }

            const res = await fetch(`${API_BASE_URL}booking/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            console.log('📦 backend booking:', data);

            if (data?.finalFare != null) {
                setFinalFare(data.finalFare);
            }
        } catch (err) {
            console.log('❌ fetch final fare error:', err);
        }
    };

    fetchFinalFare();
}, []);


    console.log('💳 PaymentOptions params:', route?.params);


    return (
        <View style={styles.container}>
            <AppHeader />

            <RideCard style={styles.rideCard}>
                <View style={styles.rowBetween}>
                    <Text style={styles.vehicleName}>{vehicleType}</Text>
                    <Text style={styles.price}>₹ {finalFare}</Text>
                </View>

                <Text style={styles.address}>
                    {distanceKm} km
                    {durationMin ? ` • ${durationMin} min` : ''}
                </Text>

                <Divider />

                <View style={styles.rowBetween}>
                    <Text style={{ fontWeight: '600' }}>Final Payable</Text>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>
                        ₹ {finalFare}
                    </Text>
                </View>
            </RideCard>


            <View style={styles.content}>
                <Text style={styles.heading}>Choose Payment Method</Text>
            </View>

            <View style={styles.content}>
                <PaymentItem
                    value="ONLINE"
                    title="Online Payment"
                    subtitle="UPI, Cards, Wallets"
                    icon="card-outline"
                />
            </View>

            <View style={styles.content}>
                <PaymentItem
                    value="CASH"
                    title="Cash"
                    subtitle="Pay directly to driver"
                    icon="cash-outline"
                />
            </View>

            <View style={styles.content}>
                <AppButton
                    title="Pay Now"
                    onPress={() => {
                        if (!paymentMethod) {
                            alert('Please select payment method');
                            return;
                        }

                        if (paymentMethod === 'ONLINE') {
                            navigation.navigate('RazorpayWeb', {
                                amount: finalFare,
                                bookingId,
                                paymentMethod: 'ONLINE',
                            });
                        } else {
                            navigation.navigate('BookingSuccess', {
                                amount: finalFare,
                                bookingId,
                                paymentMethod: 'CASH', // ✅ IMPORTANT
                            });
                        }
                    }}
                />


            </View>
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

    heading: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#222',
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },

    selectedCard: {
        borderColor: COLORS.primary,
        backgroundColor: '#EEF5FF',
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },

    subtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
});
