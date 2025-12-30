import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AppSearch({
    placeholder = "Search Destination",
    value,
    onChangeText,
    onPress,
    editable = true,
}) {
    return (
        <Pressable
            style={styles.searchBox}
            onPress={onPress}
        >
            <Ionicons
                name="search"
                size={18}
                color={COLORS.gray}
                style={styles.icon}
            />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                style={styles.searchInput}
                editable={editable}
                pointerEvents="none"   // 👈 so press works on entire box
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        borderRadius: 8,
        paddingHorizontal: 18,
        height: 48,
        marginBottom: 14,
        marginHorizontal: 16,  
    },

    icon: {
        marginRight: 8,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
        color: COLORS.black,
    },
});
