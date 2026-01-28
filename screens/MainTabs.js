import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from './screens/Dashboard';
import CurrentTrip from './screens/CurrentTrip';
import TripHistory from './screens/TripHistory';
import Profile from './screens/Profile';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="CurrentTrip" component={CurrentTrip} />
      <Tab.Screen name="TripHistory" component={TripHistory} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
