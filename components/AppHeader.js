import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import { useFocusEffect } from '@react-navigation/native';

export default function AppHeader() {
  const [customerName, setCustomerName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadCustomer = async () => {
        const data = await AsyncStorage.getItem('customer');
        // console.log('HEADER CUSTOMER 👉', data);

        if (data) {
          const customer = JSON.parse(data);
          setCustomerName(customer.firstName || '');
        }
      };

      loadCustomer();
    }, [])
  );

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        Hi, {customerName || 'Customer'}
      </Text>

      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    paddingVertical: 14,

    // Safe spacing for status bar

    backgroundColor: '#B1124D',
    elevation: 4,
    marginBottom:20
  },

  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 15
  },

  iconBtn: {
    padding: 6,
    borderRadius: 20,
    marginTop: 15

  },
});
