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
import RideCard from '../components/Card';
import Divider from '../components/Divider';


export default function Dashboard({ navigation }) {

    const vehicles = [
        { name: 'Truck', image: require('../assets/truck.png') },
        { name: 'Tempo', image: require('../assets/tempo.png') },
        { name: 'Bike', image: require('../assets/bike.png') },
        { name: 'Cab', image: require('../assets/car.png') },
    ];


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* SEARCH */}
                {/* <AppSearch
                    placeholder="Search Destination"
                    onPress={() => navigation.navigate('Booking1')}
                /> */}

                {/* SEARCH DESIGN */}
                <TouchableOpacity
                    style={styles.searchBox}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Booking1')}
                >
                    <Ionicons name="search" size={20} color="#777" />
                    <Text style={styles.searchText}>Search Destination</Text>
                </TouchableOpacity>

                {/* MAP */}
                {/* <View style={styles.mapBox}> */}
                {/* <View style={styles.offerBox}>
                    <Text style={styles.placeholder}>Map Placeholder</Text>
                </View> */}
                {/* </View> */}

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


                {/* VEHICLE TYPES */}
                <View style={styles.vehicleRow}>
                    {vehicles.map((item) => (
                        <TouchableOpacity key={item.name} style={styles.vehicleBtn}>
                            <View style={styles.imageWrapper}>
                                <Image source={item.image} style={styles.vehicleImage} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>


                {/* OFFER BANNER */}
                <View style={styles.offerBox}>
                    <Text style={styles.placeholder}>Offer Banner</Text>
                </View>

                {/* RIDE CARD */}
                <RideCard>
                    <View style={styles.driverRow}>
                        <View style={styles.driverAvatar}>
                            <Image
                                source={require('../assets/driver.png')}
                                style={styles.driverImage}
                            />
                        </View>
                        <View>
                            <Text style={styles.driverName}>Driver Name</Text>
                            <Text style={styles.address}>Pickup Address</Text>
                            <Text style={styles.address}>Drop Address</Text>
                        </View>


                    </View>
                    <TouchableOpacity style={styles.navBtn}>
                        <Text style={styles.navText} onPress={() => navigation.navigate('CurrentTrip')}>Navigation</Text>
                    </TouchableOpacity>

                    <Divider />

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>02:30 Min</Text>
                            <Text style={styles.statLabel}>Duration</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>Rs. 3240</Text>
                            <Text style={styles.statLabel}>Fare</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>34 km</Text>
                            <Text style={styles.statLabel}>Distance</Text>
                        </View>
                    </View>
                </RideCard>

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

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom:15
    },
    searchText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#777',
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

    vehicleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginHorizontal: 16,
    },

    vehicleBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        overflow: 'hidden',
    },

    imageWrapper: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },

    vehicleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    vehicleText: {
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
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

    rideCard: {
        backgroundColor: 'rgba(232, 232, 232, 1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
    },


    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 22,
        overflow: 'hidden',
        // backgroundColor: '#DDD',
        marginRight: 12,
    },

    driverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    driverName: {
        fontWeight: '700',
        fontSize: 14,
        marginTop: 8,
    },

    address: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,

    },

    navBtn: {
        marginLeft: 'auto',
        backgroundColor: '#FF1E1E',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    navText: {
        fontSize: 12,
        fontWeight: '600',
        color: "white"
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    stat: {
        alignItems: 'center',
    },

    statValue: {
        fontWeight: '700',
        fontSize: 14,
    },

    statLabel: {
        fontSize: 11,
        // color: COLORS.gray,
        marginTop: 2,

    },

    divider: {
        height: 1,
        backgroundColor: 'white',
        marginVertical: 5,
        marginLeft: -16,
        marginRight: -16,
        marginTop: 10
    },

});
