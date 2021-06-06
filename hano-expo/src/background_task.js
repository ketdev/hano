
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import { WebView } from "react-native-webview"

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
  
export default function BackgroundTask(props) {
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