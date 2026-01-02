import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppSearch from '../components/AppSearch';
import AppButton from '../components/AppButton';
import { routeCheckApi } from '../services/customerAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Booking1({ navigation }) {
    const [tripType, setTripType] = useState('CITY');
   
    const handleRouteCheck = async () => {
  try {
    const res = await routeCheckApi({
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
    });

    navigation.navigate('Booking2', {
      ...res,
      pickup: { lat: pickupLat, lng: pickupLng },
      drop: { lat: dropLat, lng: dropLng },
      tripType,
    });
  } catch (err) {
    console.log(err);
    Alert.alert('Error', 'Route check failed');
  }
};


    return (
        <View style={styles.container}>
            <ScrollView>

                <AppHeader />

                <AppSearch placeholder="Pickup location" />
                <AppSearch placeholder="Drop location" />

                {/* Trip Type */}
                <View style={styles.tripTypeRow}>
                    {['CITY', 'OUTSTATION'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.tripBtn,
                                tripType === type && styles.activeTrip,
                            ]}
                            onPress={() => setTripType(type)}
                        >
                            <Text style={styles.tripText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.content}>
                    <AppButton title="Next" onPress={handleRouteCheck} />
                </View>
            </ScrollView>

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
        paddingHorizontal: 20,
    },
    tripTypeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tripBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        marginHorizontal: 6,
    },
    activeTrip: {
        backgroundColor: COLORS.primary,
    },
    tripText: {
        color: '#fff',
        fontWeight: '600',
    },
});
