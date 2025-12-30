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
import RideCard from '../components/Card';

export default function Booking3({ navigation }) {



    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* RIDE CARD */}
                <RideCard>
                    <View style={styles.driverRow}>
                        <View style={styles.infoBlock}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.vehicleName}>2 Wheeler</Text>
                                <Text style={styles.price}>₹ 210.00</Text>
                            </View>
                            <Text style={styles.address}>20 Km · 3 Min away</Text>
                        </View>
                    </View>
                </RideCard>

                <RideCard>
                    <View style={styles.driverRow}>
                        <View style={styles.infoBlock}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.vehicleName}>Tempo</Text>
                                <Text style={styles.price}>₹ 610.00</Text>
                            </View>
                            <Text style={styles.address}>1000 Km · 2 Min away</Text>
                        </View>
                    </View>
                </RideCard>

                <RideCard>
                    <View style={styles.driverRow}>
                        <View style={styles.infoBlock}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.vehicleName}>Truck</Text>
                                <Text style={styles.price}>₹ 1610.00</Text>
                            </View>
                            <Text style={styles.address}>5000 Km · 7 Min away</Text>
                        </View>
                    </View>
                </RideCard>

                <View style={styles.content}>
                    <AppButton title="Next" onPress={() => navigation.navigate('Booking4')} />
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

    content: {
        paddingHorizontal: 16,
    },

    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    price: {
        fontWeight: '600',
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
        fontWeight: 700,
        // color:'white'

    },

    address: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,

    },

});
