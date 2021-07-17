// Import React and Component
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { BACKGROUND_COLOR } from '../theme';
import { getToken, getAccount, logout } from '../api/account';

import LoadingComponent from './LoadingComponent';

const SplashScreen = ({ navigation }) => {
  React.useEffect(() => {
    setTimeout(async () => {
      let isLoggedIn = false;
      const token = await getToken();
      if (token != null) {
        try {
          await getAccount();
          isLoggedIn = true;
        } catch (error) {
          logout();
        }
      }
      navigation.replace(isLoggedIn == true ? 'MainView' : 'Auth');
    }, 1500);
  }, []);
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo_sketch.png')}
        style={{width: '90%', resizeMode: 'contain', margin: 30}}
      />
      <LoadingComponent style={{ width: 100, height: 100 }}/>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
    color: 'black'
  },
});