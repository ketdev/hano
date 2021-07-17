import React from 'react';
import LottieView from "lottie-react-native";

export default function LoadingComponent({ ...rest }) {
    return (
        <LottieView autoPlay loop
            {...rest}
            source={require('../../assets/lf30_editor_9k8zqdda.json')}
          />
    );
}
