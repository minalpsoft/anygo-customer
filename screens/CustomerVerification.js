import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOtpApi } from '../services/customerAuth';

export default function CustomerVerification() {
  const navigation = useNavigation();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://192.168.31.89:3000/';

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    setLoading(true);

    try {
      const mobile = await AsyncStorage.getItem('otp_mobile');

      if (!mobile) {
        Alert.alert('Error', 'Mobile number missing. Please register again.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          otp,
          userType: 'customer',
        }),
      });

      const data = await res.json();
      console.log('OTP VERIFY RESPONSE 👉', data);

      if (!res.ok) {
        throw data;
      }

      if (data?.message === 'OTP verified successfully') {
        await AsyncStorage.multiRemove(['otp_mobile', 'otp_userType']);

        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]);
      } else {
        Alert.alert('Failed', 'Invalid OTP');
      }


    } catch (err) {
      console.log('OTP VERIFY ERROR 👉', err);
      Alert.alert('Error', err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };




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

      <Text style={styles.title}>Customer Verification</Text>

      <AppInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <AppButton
        title={loading ? 'Verifying...' : 'Finish'}
        onPress={handleVerifyOtp}
        disabled={loading}
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
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  },
});
