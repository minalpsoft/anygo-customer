import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CustomerVerification() {
  const navigation = useNavigation();
  const route = useRoute();

  const mobile = route.params?.mobile;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // const API_BASE_URL = 'http://10.197.26.200:5000/';

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (!mobile) {
      Alert.alert('Error', 'Mobile number missing. Please register again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          userType: 'customer',
        }),
      });

      const data = await res.json();
      console.log('OTP VERIFY RESPONSE 👉', data);

      if (!res.ok) throw data;

      Alert.alert('Success', 'Account created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    } catch (err) {
      Alert.alert('Error', err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <AppLogo />
      <Text style={styles.title}>Verify OTP</Text>

      <AppInput
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      <AppButton
        title={loading ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOtp}
        disabled={loading}
      />
    </View>
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
    marginTop: 20,
    marginBottom: 30,
  },
});
