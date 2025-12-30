import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AppHeader({ title = 'Hi, Roshan', navigation }) {
  return (
    <View style={styles.header}>
      {/* LEFT */}
      <Text style={styles.greeting}>{title}</Text>

      {/* RIGHT */}
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
    paddingTop: Platform.OS === 'android' ? 40 : 50,

    backgroundColor: '#B1124D',
    elevation: 4,
    marginBottom:20
  },

  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 20,
  },
});
