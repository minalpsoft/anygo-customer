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

 const handleVerifyOtp = async () => {
  setLoading(true);

  try {
    const mobile = await AsyncStorage.getItem('otp_mobile');

    if (!mobile || !otp) {
      Alert.alert('Error', 'OTP or mobile missing');
      return;
    }

    const res = await verifyOtpApi({
      mobile,
      otp,
      userType: 'customer',
    });

    if (res?.verified === true) {
      await AsyncStorage.removeItem('otp_mobile');
      await AsyncStorage.removeItem('otp_userType');

      Alert.alert('Success', 'Account created successfully');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } else {
      Alert.alert('Failed', 'Invalid OTP');
    }

  } catch (err) {
    Alert.alert('Error', 'OTP verification failed');
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
