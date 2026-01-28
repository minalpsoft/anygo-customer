import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import AppSearch from '../components/AppSearch';
import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Booking1({ navigation }) {
  const [tripType, setTripType] = useState('CITY');
  const [pickupText, setPickupText] = useState('');
  const [dropText, setDropText] = useState('');
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);

  // const API_BASE_URL = 'http://10.197.26.200:5000/';
  // const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  // const GOOGLE_API_KEY = 'AIzaSyCe-FeBbj44cBU0lnDPbcL-w0fTKRp_HVo'

  const getLatLngFromAddress = async (address) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`
    );

    const data = await res.json();

    if (!data.results?.length) {
      throw new Error('Invalid address');
    }

    return data.results[0].geometry.location; // { lat, lng }
  };

  // const handleRouteCheck = async () => {
  //   try {
  //     if (!pickupText || !dropText) {
  //       Alert.alert('Error', 'Enter pickup & drop location');
  //       return;
  //     }

  //     const pickupLoc = await getLatLngFromAddress(pickupText);
  //     const dropLoc = await getLatLngFromAddress(dropText);

  //     setPickup(pickupLoc);
  //     setDrop(dropLoc);

  //     const token = await AsyncStorage.getItem('token');

  //     const res = await fetch(`${API_BASE_URL}booking/route-check`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         pickupLat: pickupLoc.lat,
  //         pickupLng: pickupLoc.lng,
  //         dropLat: dropLoc.lat,
  //         dropLng: dropLoc.lng,
  //       }),
  //     });

  //     const data = await res.json();

  //     navigation.navigate('Booking2', {
  //       pickup: pickupLoc,
  //       drop: dropLoc,
  //       distanceKm: data.distanceKm,
  //       durationMin: data.durationMin,
  //       tripType,
  //       pickupText,
  //       dropText,
  //     });

  //   } catch (err) {
  //     console.log(err);
  //     Alert.alert('Error', 'Route check failed');
  //   }
  // };

  const handleRouteCheck = async () => {
  try {
    if (!pickupText || !dropText) {
      Alert.alert('Error', 'Enter pickup & drop location');
      return;
    }

    const pickupLoc = await getLatLngFromAddress(pickupText);
    const dropLoc = await getLatLngFromAddress(dropText);

    setPickup(pickupLoc);
    setDrop(dropLoc);

    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}booking/route-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickupLat: pickupLoc.lat,
        pickupLng: pickupLoc.lng,
        dropLat: dropLoc.lat,
        dropLng: dropLoc.lng,
      }),
    });

    const data = await res.json();

    // ❌ CITY / DRIVER NOT AVAILABLE
    if (!res.ok) {
      Alert.alert(
        'Service Not Available',
        data.message || 'Booking is not available for this city'
      );
      return;
    }

    // ✅ SUCCESS → move ahead
    navigation.navigate('Booking2', {
      pickup: pickupLoc,
      drop: dropLoc,
      distanceKm: data.distanceKm,
      durationMin: data.durationMin,
      tripType,
      pickupText,
      dropText,
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

        <AppSearch
          placeholder="Pickup location"
          value={pickupText}
          onChangeText={setPickupText}
        />

        <AppSearch
          placeholder="Drop location"
          value={dropText}
          onChangeText={setDropText}
        />

        <View style={styles.mapBox}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            region={
              pickup
                ? {
                  latitude: pickup.lat,
                  longitude: pickup.lng,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
                : {
                  latitude: 18.5204,
                  longitude: 73.8567, // Pune default
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
            }
          >
            {pickup && (
              <Marker
                coordinate={{
                  latitude: pickup.lat,
                  longitude: pickup.lng,
                }}
                title="Pickup"
              />
            )}

            {drop && (
              <Marker
                coordinate={{
                  latitude: drop.lat,
                  longitude: drop.lng,
                }}
                title="Drop"
              />
            )}
          </MapView>
        </View>

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
});
