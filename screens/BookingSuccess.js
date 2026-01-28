import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import BottomTabs from '../components/BottomTabs';
import { useNavigation } from '@react-navigation/native';

export default function BookingSuccess() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>

            <AppHeader title="Ride Completed" />

            <View style={styles.content}>
                <Ionicons
                    name="checkmark-circle"
                    size={90}
                    color="green"
                />

                <Text style={styles.title}>Payment Successful</Text>

                <Text style={styles.subText}>
                    Your ride has been completed successfully.
                </Text>

                <Text style={styles.thankYou}>
                    Thank you for choosing our service 🚚
                </Text>

                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.replace('Dashboard')}
                >
                    <Text style={styles.primaryText}>Go to Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('TripHistory')}
                >
                    <Text style={styles.secondaryText}>View My Bookings</Text>
                </TouchableOpacity>
            </View>

            <BottomTabs />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subText: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
        textAlign: 'center',
    },
    thankYou: {
        marginTop: 10,
        fontSize: 14,
        color: '#777',
    },
    primaryBtn: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    primaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        marginTop: 15,
    },
    secondaryText: {
        color: COLORS.primary,
        fontSize: 15,
    },
});
