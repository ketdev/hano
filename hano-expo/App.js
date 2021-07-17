import 'react-native-gesture-handler';
import React from 'react';
import { DefaultTheme, Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import MainView from './src/ui/MainView';
import SplashScreen from './src/ui/SplashScreen';
import LoginScreen from './src/t/LoginView';
import RegisterScreen from './src/t/RegisterView';

// Load model
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/model/store';

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
    <ReduxProvider store={store}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainView"
              component={MainView}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ReduxProvider>
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