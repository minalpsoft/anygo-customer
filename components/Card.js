import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function RideCard({ children }) {
  return <View style={styles.rideCard}>{children}</View>;
}

const styles = StyleSheet.create({
  rideCard: {
    backgroundColor: '#FFF5F5',        // same soft background
    borderLeftWidth: 5,                 // accent like Card
    borderLeftColor: COLORS.primary,    // brand color
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    elevation: 3,
  },
});
