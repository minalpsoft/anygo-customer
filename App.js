import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import CreateAccount from './screens/CreateAccount';
import CustomerVerification from './screens/CustomerVerification';
import Dashboard from './screens/Dashboard';
import Booking1 from './screens/Booking1';
import Booking2 from './screens/Booking2';
import Booking3 from './screens/Booking3';
import Booking4 from './screens/Booking4';
import Booking5 from './screens/Booking5';
import CurrentTrip from './screens/CurrentTrip';
import TripHistory from './screens/TripHistory';
import Profile from './screens/Profile';
import PaymentOptions from './screens/PaymentOptions';
import BookingSuccess from './screens/BookingSuccess';
// import PaymentGateway from './screens/PaymentGateway';
import RazorpayWeb from './screens/RazorpayWeb';
import SearchingDriver from './screens/SearchingDriver';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import RazorpayWeb1 from './screens/RazorpayWeb1';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* AUTH FLOW */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="CustomerVerification" component={CustomerVerification} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Booking1" component={Booking1} />
        <Stack.Screen name="Booking2" component={Booking2} />
        <Stack.Screen name="Booking3" component={Booking3} />
        <Stack.Screen name="Booking4" component={Booking4} />
        <Stack.Screen name="Booking5" component={Booking5} />
        <Stack.Screen name="CurrentTrip" component={CurrentTrip} />
        <Stack.Screen name="TripHistory" component={TripHistory} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
        {/* <Stack.Screen name="PaymentGateway" component={PaymentGateway} /> */}
        <Stack.Screen name="RazorpayWeb" component={RazorpayWeb} />
        <Stack.Screen name="SearchingDriver" component={SearchingDriver} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="RazorpayWeb1" component={RazorpayWeb1} />

        {/* APP FLOW */}
        {/* <Stack.Screen name="DriverDashboard" component={DrawerNavigator} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
