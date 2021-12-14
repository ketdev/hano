import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import { Avatar, Button, Card, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { refreshArticles } from '../../model/action';

import HeaderComponent from './HeaderComponent';

export default function KeywordsView(props) {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.loading);
    const keywords = [];//useSelector(state => state.account.keywords);
    const account = useSelector(state => state.account);

    React.useEffect(() => alert(JSON.stringify(account)), []);

    return (
        <View style={styles.container}>
            <HeaderComponent title='Keywords' />
            <SafeAreaView style={styles.container}>
                <FlatList data={keywords}
                    keyExtractor={(k, index) => k}
                    renderItem={(k) => (
                        <Chip key={k} mode='flat'>{k}</Chip>
                    )}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        backgroundColor: '#f0f4f3cc',
        width: '100%',
        height: '100%',
    },
    loader: {
        width: 100,
        height: 100
    },
    tinyLogo: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    chips: {
        flexDirection: 'row',
    }
});
