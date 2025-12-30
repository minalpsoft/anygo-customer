import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [accepted, setAccepted] = useState(false);

    return (
        <LinearGradient
            colors={['#ffffff', '#f2f6ff']}
            style={styles.container}
        >

            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <AppLogo />

            <Text style={styles.title}>Create Account</Text>

            <AppInput placeholder="Enter First Name" />
            <AppInput placeholder="Enter Last Name" />
            <AppInput placeholder="Enter Mobile Number" />
            <AppInput placeholder="Enter Email" />

            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={accepted}
                    onValueChange={setAccepted}
                    color={accepted ? COLORS.primary : undefined}
                />

                <TouchableOpacity onPress={() => alert('Open Terms & Conditions')}>
                    <Text style={styles.termsText}>
                        I agree to accept Terms & Conditions
                    </Text>
                    <Text style={styles.termsText}>
                        <Text style={styles.link}>Click here </Text>to read Terms and Conditions and Privacy Policy
                    </Text>
                </TouchableOpacity>
            </View>

            <AppButton title="Next"
                onPress={() => navigation.navigate('Dashboard')}
            // navigation.replace('App'); 
            />

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    backContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        padding: 20,
        // justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        marginLeft: 10,
        marginRight: 10
    },
    termsText: {
        marginLeft: 10,
        color: COLORS.black,
    },
    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    links: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 6,
    },
    link: {
        color: '#1E88E5',
        fontSize: 14,
        fontWeight: '500',
    },

});
