import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { customerRegisterApi } from '../services/customerAuth';

export default function LoginScreen() {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !mobile || !email) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!accepted) {
      Alert.alert('Error', 'Please accept Terms & Conditions');
      return;
    }

    try {
      setLoading(true);

      await customerRegisterApi({
        firstName,
        lastName,
        mobile,
        email,
        password: '123456', // TEMP password (can add input later)
        acceptedTerms: accepted,
      });

      Alert.alert(
        'Success',
        'Account created successfully. Please login.'
      );

      navigation.replace('LoginScreen');

    } catch (err) {
      Alert.alert(
        'Registration Failed',
        err?.message || 'Something went wrong'
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

            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <AppLogo />

            <Text style={styles.title}>Create Account</Text>

             <AppInput placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />
      <AppInput placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} />
      <AppInput placeholder="Enter Mobile Number" keyboardType="number-pad" value={mobile} onChangeText={setMobile} />
      <AppInput placeholder="Enter Email" keyboardType="email-address" value={email} onChangeText={setEmail} />

      {/* <View style={styles.checkboxContainer}>
        <Checkbox
          value={accepted}
          onValueChange={setAccepted}
          color={accepted ? COLORS.primary : undefined}
        />

        <TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to accept Terms & Conditions
          </Text>
          <Text style={styles.termsText}>
            <Text style={styles.link}>Click here </Text>
            to read Terms and Conditions and Privacy Policy
          </Text>
        </TouchableOpacity>
      </View> */}

      <AppButton
        title={loading ? 'Creating...' : 'Next'}
        onPress={handleRegister}
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
