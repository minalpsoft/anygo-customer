import { View, Text, StyleSheet, Alert } from 'react-native';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { customerLoginApi } from '../services/customerAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function LoginScreen() {
  const navigation = useNavigation();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const API_BASE_URL = 'http://10.197.26.200:5000/';

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Error', 'Mobile & password required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: String(mobile),
          password,
        }),
      });

      const data = await res.json();
      // console.log('LOGIN RESPONSE 👉', data);

      if (!res.ok) {
        throw data;
      }

      if (!data?.token) {
        throw new Error('Token missing from response');
      }

      // ✅ Store token
      await AsyncStorage.setItem('token', data.token);
      // console.log('STORED TOKEN 👉', data.token);

      // ✅ Go to dashboard & reset stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });

    } catch (err) {
      console.log('LOGIN ERROR 👉', err);

      Alert.alert(
        'Login Failed',
        err?.message || 'Invalid mobile or password'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <LinearGradient
      colors={['#ffffff', '#f2f6ff']}
      style={styles.container}
    >

      {/* <AppLogo /> */}

      <Text style={styles.title}>Customer Login</Text>

      <AppInput
        placeholder="Enter Mobile Number"
        keyboardType="number-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <AppInput
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AppButton
        title={loading ? 'Logging in...' : 'Submit'}
        onPress={handleLogin}
      />



      <View style={styles.links}>
     <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')} > Forgot Password</Text>
        <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')}>Create Account</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 20,
  //   padding: 20,
  //   marginTop: 20,
  //   elevation: 5,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
  // },

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
