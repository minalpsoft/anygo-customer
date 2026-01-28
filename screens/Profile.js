import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import BottomTabs from '../components/BottomTabs';
import AppHeader from '../components/AppHeader';
import RideCard from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import Divider from '../components/Divider';
import {
    getCustomerProfileApi,
    updateCustomerProfileApi
} from '../services/customerAuth';
import axios from 'axios';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Profile({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // const loadProfile = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         console.log('cust profile token 👉', token);

    //         const response = await axios.get(
    //             'http://10.197.26.200:5000/customer/profile',
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         console.log('PROFILE SUCCESS 👉', response.data);

    //         // ✅ Set profile data
    //         setProfile(response.data);

    //         await AsyncStorage.setItem(
    //             'customer',
    //             JSON.stringify(response.data)
    //         );

    //     } catch (error) {
    //         console.log(
    //             'PROFILE ERROR 👉',
    //             error?.response?.data || error.message
    //         );
    //         // Alert.alert('Error', 'Failed to load profile');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('cust profile token 👉', token);

        const response = await axios.get(
            `${API_BASE_URL}customer/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log('PROFILE SUCCESS 👉', response.data);

        setProfile(response.data);

        await AsyncStorage.setItem(
            'customer',
            JSON.stringify(response.data)
        );

    } catch (error) {
        console.log(
            'PROFILE ERROR 👉',
            error?.response?.data || error.message
        );
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        loadProfile();
    }, []);

    const openEditModal = () => {
        if (!profile) return;
        setEditProfile({ ...profile });
        setShowEditModal(true);
    };

    const saveProfile = async () => {
        try {
            await updateCustomerProfileApi({
                _id: profile._id,   // ✅ REQUIRED
                firstName: editProfile.firstName,
                lastName: editProfile.lastName,
                email: editProfile.email,
            });

            Alert.alert('Success', 'Profile updated');
            setShowEditModal(false);
            loadProfile();

        } catch (err) {
            Alert.alert(
                'Error',
                err?.response?.data?.message || 'Update failed'
            );
        }
    };


    const logout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };



    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading profile...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppHeader navigation={navigation} />

                <RideCard>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>My Profile</Text>

                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={openEditModal}
                        >
                            <Text style={styles.link}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text>First Name</Text>
                        <Text>{profile?.firstName || '-'}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Last Name</Text>
                        <Text>{profile?.lastName || '-'}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Mobile</Text>
                        <Text>{profile?.mobile || '-'}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Email</Text>
                        <Text>{profile?.email || '-'}</Text>
                    </View>
                </RideCard>

                <View style={styles.content}>
                    <AppButton title="Logout" onPress={logout} />
                </View>
            </ScrollView>

            <BottomTabs />

            {/* 🔽 EDIT PROFILE MODAL */}
            <Modal visible={showEditModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>

                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <AppInput
                            placeholder="First Name"
                            value={editProfile?.firstName}
                            onChangeText={(v) =>
                                setEditProfile({ ...editProfile, firstName: v })
                            }
                        />

                        <AppInput
                            placeholder="Last Name"
                            value={editProfile?.lastName}
                            onChangeText={(v) =>
                                setEditProfile({ ...editProfile, lastName: v })
                            }
                        />

                        <AppInput
                            placeholder="Email"
                            value={editProfile?.email}
                            onChangeText={(v) =>
                                setEditProfile({ ...editProfile, email: v })
                            }
                        />

                        <AppInput
                            placeholder="Mobile"
                            value={editProfile?.mobile}
                            editable={false}
                        />

                        <AppButton title="Save Changes" onPress={saveProfile} />

                        <TouchableOpacity onPress={() => setShowEditModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    content: {
        paddingHorizontal: 16,
    },

    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',

    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 6,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    }, acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
    },
    divider: {
        height: 1,
        backgroundColor: 'white',
        marginVertical: 5,
        marginLeft: -16,
        marginRight: -16,
        marginTop: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },

    cancelText: {
        textAlign: 'center',
        color: COLORS.danger,
        marginTop: 15,
        fontWeight: '500',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },

    acceptBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
    },

    link: {
        color: COLORS.white,
        fontWeight: '600',
    },

});
