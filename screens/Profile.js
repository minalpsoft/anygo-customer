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
import RideCard from '../components/Card';
import MapView, { Marker } from 'react-native-maps';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import Divider from '../components/Divider';

export default function Profile({ navigation }) {



    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <AppHeader />

                {/* trip history */}
                <RideCard>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>My Profile</Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.link}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>First Name</Text>
                        <Text style={styles.amount1}>Roshan</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Last Name</Text>
                        <Text style={styles.amount1}>Patil</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Mobile Number</Text>
                        <Text style={styles.amount1}>+91 1234567890</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Email</Text>
                        <Text style={styles.amount1}>roshanpatilgmail.com</Text>
                    </View>
                </RideCard>

 <View style={styles.content}>
                    <AppButton title="Logout" onPress={() => navigation.navigate('Booking4')} />
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
    
    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',
        
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 6,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    }, acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
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
