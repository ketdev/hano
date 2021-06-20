import 'react-native-gesture-handler';

// Import React and Component
import React from 'react';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { processColor } from 'react-native';
import color from 'color';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Navigators from React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import MainView from './src/MainView';

// Import Screens
import SplashScreen from './src/t/SplashScreen';
import LoginScreen from './src/t/LoginView';
import RegisterScreen from './src/t/RegisterView';
import DrawerNavigationRoutes from './src/t/DrawerNavigationRoutes';


const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      {/* <MainView /> */}

      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            // Hiding header for Splash Screen
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DrawerNavigationRoutes"
            component={DrawerNavigationRoutes}
            // Hiding header for Navigation Drawer
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>

    </PaperProvider>
  );
}

const theme = {
  ...DefaultTheme,
  dark: false,
  mode: 'adaptive', // exact
  colors: {
    ...DefaultTheme.colors
  },
};

export default App;