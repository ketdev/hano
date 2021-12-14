// Import React and Component
import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Icon,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Loader from './Loader';
import * as Theme from '../theme';

import { emailAccess } from '../api/account';

const LoginScreen = ({ navigation }) => {

  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = async () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }

    setLoading(true);
    try {
      await emailAccess(userEmail);
      navigation.replace('MainView');
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.mainView}>
      <StatusBar style="dark" />
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <KeyboardAvoidingView enabled>

          <View style={styles.section}>
            <Text style={styles.titleText}>
              Welcome!
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitleText}>
              Enter your email to create {"\n"}
              or access your account
            </Text>
          </View>

          {/* Error text */}
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}

          {/* Email input field */}
          <View style={styles.inputView}>
            <Theme.ICON_EMAIL style={styles.inputIcon} width={30} height={30} />
            <TextInput
              style={styles.inputText}
              placeholder="user@email.com"
              placeholderTextColor={Theme.TEXT_SOFT_COLOR}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            //onSubmitEditing={() => }
            />
          </View>

          {/* CONTINUE button */}
          <TouchableHighlight
            style={styles.continueView}
            underlayColor={Theme.CONTINUE_BACKGROUND_BORDER}
            // activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableHighlight>


          {/* OR separator */}
          <View style={styles.separatorView}>
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine}></View>
          </View>

          {/* Facebook button */}
          <TouchableHighlight
            style={styles.facebookView}
            underlayColor={Theme.FACEBOOK_BACKGROUND_BORDER}
            // activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <View style={styles.facebookViewInner}>
              <Text style={styles.facebookText}>Sign in with Facebook</Text>
              <Theme.ICON_FACEBOOK style={styles.facebookIcon} width={40} height={40} />
            </View>
          </TouchableHighlight>

          {/* Google button */}
          <TouchableHighlight
            style={styles.googleView}
            underlayColor={Theme.GOOGLE_BACKGROUND_BORDER}
            // activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <View style={styles.googleViewInner}>
              <Text style={styles.googleText}>Sign in with Google</Text>
              <Theme.ICON_GOOGLE style={styles.googleIcon} width={40} height={40} />
            </View>
          </TouchableHighlight>

          {/* Agreement */}
          <View style={styles.section}>
            <Text style={styles.agreementText}>
              By registering, you agree with the {' '}
            </Text>
            <Text style={styles.agreementLinkText}>
              Application Policy
            </Text>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: Theme.BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: Theme.CENTER_WIDTH,
    // backgroundColor: '#f0f', // DEBUG
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: '#ffff00', // DEBUG
  },
  titleText: {
    fontFamily: Theme.FONT_BOLD,
    fontSize: Theme.FONT_SIZE_TITLE,
    color: Theme.TEXT_COLOR
  },
  subtitleText: {
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 20
  },

  // Email input field
  inputView: {
    flexDirection: 'row',
    marginVertical: 6,
    height: 60,
    width: Theme.CENTER_WIDTH,
    backgroundColor: Theme.INPUT_BACKGROUND,
    borderColor: Theme.INPUT_BACKGROUND_BORDER,
    borderRadius: 10,
    borderWidth: 1,
    borderTopWidth: 3
  },
  inputIcon: {
    marginVertical: 13,
    marginHorizontal: 20,
    color: Theme.TEXT_SOFT_COLOR
  },
  inputText: {
    flex: 1,
    marginRight: 50, // (20+30)
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.TEXT_COLOR,
    textAlign: 'center'
  },

  // CONTINUE button
  continueView: {
    marginVertical: 6,
    justifyContent: 'center',
    height: 60,
    width: Theme.CENTER_WIDTH,
    backgroundColor: Theme.CONTINUE_BACKGROUND,
    borderColor: Theme.CONTINUE_BACKGROUND_BORDER,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 3
  },
  continueText: {
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.CONTINUE_TEXT_COLOR,
    textAlign: 'center'
  },

  // Separator
  separatorView: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center'
  },
  separatorText: {
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.TEXT_COLOR_DISABLED,
    height: 20,
    marginLeft: 10
  },
  separatorLine: {
    flex: 1,
    height: 2,
    marginVertical: 9,
    marginHorizontal: 10,
    backgroundColor: Theme.INPUT_BACKGROUND
  },

  // Facebook button
  facebookView: {
    marginVertical: 6,
    justifyContent: 'center',
    height: 60,
    width: Theme.CENTER_WIDTH,
    backgroundColor: Theme.FACEBOOK_BACKGROUND,
    borderColor: Theme.FACEBOOK_BACKGROUND_BORDER,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 3
  },
  facebookViewInner: {
    flexDirection: 'row',
  },
  facebookIcon: {
    marginVertical: 13,
    marginHorizontal: 20,
    color: Theme.CONTINUE_TEXT_COLOR,
  },
  facebookText: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'left',
    marginLeft: 25,
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.CONTINUE_TEXT_COLOR,
  },

  // Google button
  googleView: {
    marginVertical: 6,
    justifyContent: 'center',
    height: 60,
    width: Theme.CENTER_WIDTH,
    backgroundColor: Theme.GOOGLE_BACKGROUND,
    borderColor: Theme.GOOGLE_BACKGROUND_BORDER,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 3
  },
  googleViewInner: {
    flexDirection: 'row',
  },
  googleIcon: {
    marginVertical: 13,
    marginHorizontal: 20,
    color: Theme.CONTINUE_TEXT_COLOR,
  },
  googleText: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'left',
    marginLeft: 25,
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SUBTITLE,
    color: Theme.CONTINUE_TEXT_COLOR,
  },

  // Agreement text
  agreementText: {
    marginTop: 20, 
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SMALLPRINT,
    color: Theme.TEXT_COLOR_DISABLED,
    textAlign: 'center',
    marginBottom: 20
  },
  agreementLinkText: {
    marginTop: 20, 
    fontFamily: Theme.FONT_SEMIBOLD,
    fontSize: Theme.FONT_SIZE_SMALLPRINT,
    color: Theme.TEXT_COLOR_DISABLED,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline'
  }

});