import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import BottomTabs from '../components/BottomTabs';
import { bookingEstimateApi } from '../services/customerAuth';

export default function Booking2({ route, navigation }) {
  const { pickup, drop, distanceKm, durationMin, tripType } = route.params;
  const token = 'USER_JWT_TOKEN';

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getEstimate();
  }, []);

  const getEstimate = async () => {
    const res = await bookingEstimateApi({
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropLat: drop.lat,
      dropLng: drop.lng,
    });

    setVehicles(res.vehicles);
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
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            <Marker coordinate={pickup} title="Pickup" />
            <Marker coordinate={drop} title="Drop" />

            {/* POLYLINE */}
            <Polyline
              coordinates={[pickup, drop]}
              strokeWidth={4}
              strokeColor="#1E88E5"
            />
          </MapView>
        </View>

        {/* INFO */}
        <Text style={styles.info}>Distance: {distanceKm} km</Text>
        <Text style={styles.info}>Duration: {durationMin} min</Text>

        {/* VEHICLES */}
        {vehicles.map(v => (
          <View key={v.vehicleType} style={styles.vehicleCard}>
            <Text>{v.vehicleType}</Text>
            <Text>ETA: {v.etaMin} min</Text>
            <AppButton
              title="Select"
              onPress={() =>
                navigation.navigate('Booking3', {
                  vehicle: v,
                  pickup,
                  drop,
                  distanceKm,
                  durationMin,
                  tripType,
                })
              }
            />
          </View>
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
