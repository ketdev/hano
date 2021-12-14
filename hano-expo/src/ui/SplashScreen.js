// Import React and Component
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { BACKGROUND_COLOR } from '../theme';
import { renewToken } from '../api/account';

import LoadingComponent from './LoadingComponent';

const SplashScreen = ({ navigation }) => {

  React.useEffect(() => {
    setTimeout(async () => {
      try {
        let isLoggedIn = await renewToken();
        navigation.replace(isLoggedIn == true ? 'MainView' : 'Auth');        
      } catch (error) {
        navigation.replace('Auth');
      }
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