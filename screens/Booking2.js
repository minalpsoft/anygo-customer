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

export default function Booking2({ navigation }) {



    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* SEARCH */}
                <AppSearch placeholder="Pickup Address" />
                <AppSearch placeholder="Drop Address" />

              <View style={styles.mapBox}>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFillObject}
                            initialRegion={{
                                latitude: 19.0760,
                                longitude: 72.8777,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        />
                    </View>
                </View>

                <View style={styles.content}>
                    <AppInput placeholder="Receiver's Name" />
                    <AppInput placeholder="Receiver's Mobile Number" />
                    <AppButton title="Next" onPress={() => navigation.navigate('Booking3')} />
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
