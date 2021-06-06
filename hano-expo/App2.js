import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location";
// ----------------------------------------------
import AsyncStorage from '@react-native-async-storage/async-storage';


const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
  }
}
const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
}

// ----------------------------------------------


const TASK_NAME = "BACKGROUND_TASK"
const INTERVAL = 5

// TaskManager.defineTask(TASK_NAME, async () => {
//   try {
//     // fetch data here...
//     const receivedNewData = "Simulated fetch " + Math.random();
//     alert("My task ", receivedNewData);
//     return receivedNewData
//       ? BackgroundFetch.Result.NewData
//       : BackgroundFetch.Result.NoData;
//   } catch (err) {
//     return BackgroundFetch.Result.Failed;
//   }
// });
BackgroundFetch.setMinimumIntervalAsync(INTERVAL);
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log('Running background task');
    alert('Running background task');
    await storeData('Test');
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    alert(error);
    return BackgroundFetch.Result.Failed;
  }
});

async function runBackgroundSaga() {
  try {
    console.log('Running background task');
    alert('Running background task');
    await storeData('Test');
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    alert(error);
    return BackgroundFetch.Result.Failed;
  }
}

async function Getir() {
  try {
    const value = await getData();

    alert('Value:' + value);
  } catch (error) {
    alert(error);
  }
}

async function registerTaskAsync() {
  console.log(`Can use task-manager: ${await TaskManager.isAvailableAsync()}`);

  // await BackgroundFetch.unregisterTaskAsync(TASK_NAME);

  const status = await BackgroundFetch.getStatusAsync();
  switch (status) {
    case BackgroundFetch.Status.Restricted:
    case BackgroundFetch.Status.Denied:
      console.log("Background execution is disabled");
      return;

    default: {
      console.debug("Background execution allowed");

      let tasks = await TaskManager.getRegisteredTasksAsync();
      if (tasks.find(f => f.taskName === TASK_NAME) == null) {
        console.log("Registering task");
        Location.startLocationUpdatesAsync(TASK_NAME);
        await BackgroundFetch.registerTaskAsync(TASK_NAME, {
          minimumInterval: 5, // seconds,
          // stopOnTerminate: false,
          // startOnBoot: true
        });

        tasks = await TaskManager.getRegisteredTasksAsync();
        console.debug("Registered tasks", tasks);
      } else {
        console.log(`Task ${TASK_NAME} already registered, skipping`);
      }

    }
  }

  const tasks = await TaskManager.getRegisteredTasksAsync();
  console.log(tasks);
}

// ----------------------------------------------------------------------------


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerTaskAsync();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          // await sendPushNotification(expoPushToken);
          await Getir();
        }}
      />
    </View>
  );
}

// ----------------------------------------------

function App2() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    justifyContent: 'space-around',
  },
});


// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


