import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import BottomTabs from '../components/BottomTabs';
import AppInput from '../components/AppInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Booking2({ route, navigation }) {
  const {
    pickup,
    drop,
    distanceKm,
    durationMin,
    tripType,
    pickupText,
    dropText,
  } = route.params;

  const [receiverName, setReceiverName] = useState('');
  const [receiverMobile, setReceiverMobile] = useState('');

  const getEstimate = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}booking/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropLat: drop.lat,
        dropLng: drop.lng,
      }),
    });

    const data = await res.json();
    setVehicles(data.vehicles);
  };


  return (
    <View style={styles.container}>
      <ScrollView>

        <AppHeader />

        {/* MAP WITH ROUTE */}
        <View style={styles.mapBox}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: pickup.lat,
              longitude: pickup.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} />
            <Marker coordinate={{ latitude: drop.lat, longitude: drop.lng }} />

            <Polyline
              coordinates={[
                { latitude: pickup.lat, longitude: pickup.lng },
                { latitude: drop.lat, longitude: drop.lng },
              ]}
              strokeWidth={4}
              strokeColor="#000"
            />
          </MapView>

        </View>

        {/* INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{distanceKm} km</Text>
          </View>

          {/* <View style={styles.divider} /> */}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{durationMin} min</Text>
          </View>
        </View>


        <View style={styles.content}>
          {/* <AppInput placeholder="Receiver Name" />
          <AppInput placeholder="Receiver Mobile" /> */}

          <AppInput
            placeholder="Receiver Name"
            value={receiverName}
            onChangeText={setReceiverName}
          />

          <AppInput
            placeholder="Receiver Mobile"
            keyboardType="phone-pad"
            value={receiverMobile}
            onChangeText={setReceiverMobile}
          />


          <AppButton
            title="Next"
            onPress={() => {
              navigation.navigate('Booking3', {
                pickup,
                drop,
                distanceKm,
                durationMin,
                tripType,
                receiverName,
                receiverMobile,
              });

            }}
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

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 14,
    color: '#0a0a0aff',
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  content: {
    paddingHorizontal: 16,
  },
  mapBox: {
    height: 300,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },

  mapContainer: {
    flex: 1,
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

});
