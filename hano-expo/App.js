import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { WebView } from "react-native-webview"
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"

const TASK_NAME = "BACKGROUND_TASK"

TaskManager.defineTask(TASK_NAME, () => {
  try {
    // fetch data here...
    const receivedNewData = "Simulated fetch " + Math.random()
    console.log("My task ", receivedNewData)
    return receivedNewData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData
  } catch (err) {
    return BackgroundFetch.Result.Failed
  }
});

const registerTaskAsync = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 5, // seconds,
    })
    console.log("Task registered")
  } catch (err) {
    console.log("Task Register failed:", err)
  }
}


function BackgroundTask(props) {
  return (
    <WebView
      onMessage={props.function}
      source={{
        html: `<script>
          setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval})
          </script>`,
      }}
    />
  )
}


export default function App() {
  useEffect(() => {
    registerTaskAsync();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <BackgroundTask
        interval={1000}
        function={() => {
          console.log("My task " + Math.random());
        }}
      />
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
