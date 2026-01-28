import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function PaymentGateway() {

    const navigation = useNavigation();

    useEffect(() => {
        startPayment();
    }, []);

    const startPayment = () => {
        const options = {
            description: 'Ride Payment',
            image: 'https://rzp.io/i/nYROtH8', 
            currency: 'INR',
            key: 'rzp_test_RyWXVtaCyps0zs',
            amount: 50000, // ₹500
            name: 'AnyGo',
            prefill: {
                email: 'test@example.com',
                contact: '9999999999',
                name: 'Test User',
            },
            theme: { color: COLORS.primary },
        };

        RazorpayCheckout.open(options)
            .then((data) => {
                console.log('Payment Success:', data);
                navigation.replace('BookingSuccess');
            })
            .catch((error) => {
                console.log('Razorpay Error:', error);
                Alert.alert(
                    'Payment Failed',
                    error.description || 'Payment was cancelled'
                );
                navigation.goBack();
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Opening Payment Gateway...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
    },
});











// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { COLORS } from '../theme/colors';
// import { useNavigation } from '@react-navigation/native';

// export default function PaymentGateway() {

//     const navigation = useNavigation();

//     useEffect(() => {
//         // Simulate payment processing
//         setTimeout(() => {
//             navigation.replace('BookingSuccess');
//         }, 2500);
//     }, []);

//     return (
//         <View style={styles.container}>
//             <ActivityIndicator size="large" color={COLORS.primary} />
//             <Text style={styles.text}>Processing Payment...</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     text: {
//         marginTop: 16,
//         fontSize: 16,
//         color: COLORS.text,
//     },
// });
