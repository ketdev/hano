import React from 'react';
import { Dimensions, StyleSheet, Alert, View } from 'react-native';
import { Banner, DefaultTheme, Appbar, Menu, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('screen');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../../model/action';

export default function HeaderComponent({ title, subtitle, ...rest }) {
    const dispatch = useDispatch();
    const errorMessage = useSelector(state => state.error);

    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const logoutClick = () => {
        closeMenu();
        Alert.alert(
            'Logout',
            'Are you sure? You want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        return null;
                    },
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        await logout();
                        props.navigation.replace('Auth');
                    },
                },
            ],
            { cancelable: false },
        );
    };

    return (
        <View>
            <StatusBar style="dark" />

            <Appbar.Header theme={appbarTheme}>
                {/* <Appbar.BackAction onPress={() => navigation.goBack()} /> */}
                <Appbar.Content style={styles.title} title={title} subtitle={subtitle} />
                {/* <Appbar.Action icon="magnify" onPress={() => { }} /> */}

                <Menu style={styles.menu}
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}>
                    {/* <Menu.Item onPress={() => { }} title="Item 1" />
                    <Menu.Item onPress={() => { }} title="Item 2" />
                    <Divider /> */}
                    <Menu.Item onPress={logoutClick} title="Logout" />
                </Menu>
            </Appbar.Header>

            <Banner
                visible={errorMessage != null}
                actions={[
                    { label: 'Dismiss', onPress: () => dispatch(setError()) },
                ]}>
                {errorMessage}
            </Banner>
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
    title: {
        fontWeight: "bold",
    },
    tinyLogo: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    },
    menu: {
        flex: 1,
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
    },
    button: {
        marginTop: 10
    },
    buttonContainer: {
        width: width / 2,
        height: height / 15
    }
});

const appbarTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'white'
    },
};
