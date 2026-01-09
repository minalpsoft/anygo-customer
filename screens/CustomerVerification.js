import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';

export default function CustomerVerification() {
  const navigation = useNavigation();
  const route = useRoute();

  const mobile = route.params?.mobile; // ✅ GET MOBILE HERE

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://192.168.31.89:3000/';

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
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  },
});
