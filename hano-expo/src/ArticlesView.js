import React from 'react';
import axios from 'axios';
import { DefaultTheme, Appbar, BottomNavigation } from 'react-native-paper';
import { Platform, StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Banner } from 'react-native-paper';

import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

function onLogin() {
    const email = 'admin@hano.com';
    const password = '123456';
    const userData = {
        email: email,
        password: password
    };
    axios
        .post('https://hano-server.firebaseapp.com/api/user/login', userData)
        .then((response) => {
            console.log(response.data.token);
            // localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
            // this.setState({ 
            //     loading: false,
            // });		
            // this.props.history.push('/');
        })
        .catch((error) => {
            console.log(error.response.data);
            // this.setState({
            //     errors: error.response.data,
            //     loading: false
            // });
        });
}

export default function ArticlesView() {
    const [visible, setVisible] = React.useState(true);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Appbar.Header theme={appbarTheme}>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="Title" subtitle={'Subtitle'} />
                <Appbar.Action icon="magnify" onPress={() => { }} />
                <Appbar.Action icon={MORE_ICON} onPress={() => { }} />
            </Appbar.Header>

            <Banner
                visible={visible}
                actions={[
                    { label: 'Fix it', onPress: () => setVisible(false), },
                    { label: 'Learn more', onPress: () => setVisible(false), },
                ]}>
                Error Message!
            </Banner>

            <Button icon="star" mode="contained" onPress={() => setVisible(true)}>
                Show banner
            </Button>
            <Button icon="star" mode="contained" onPress={onLogin}>
                Login
            </Button>

            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <Card style={styles.card}>
                        <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
                        <Card.Actions>
                            <Button>Cancel</Button>
                            <Button>Ok</Button>
                        </Card.Actions>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Image style={styles.tinyLogo} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png', }} />
                            <Title>Card title</Title>
                            <Paragraph>Card content</Paragraph>
                        </Card.Content>
                    </Card>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
});

const appbarTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'white'
    },
};

