import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, View, RefreshControl } from 'react-native';
import { Alert, Modal, Text, TouchableHighlight } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { refreshArticles } from '../../model/action';

import HeaderComponent from './HeaderComponent';
import ArticleComponent from './ArticleComponent';

export default function ArticlesView(props) {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.loading);
    const articles = useSelector(state => state.articles.filter(x => !x.seen));

    const onRefresh = React.useCallback(() => {
        refreshArticles(dispatch);
    }, []);

    const onClick = (item) => {
        console.log(item.title);
        setModalVisible(true);
        setSelectedItem(item);
    };

    return (
        <View style={styles.container}>
            <HeaderComponent title='Feed' />
            <SafeAreaView style={styles.container}>
                <FlatList data={articles}
                    keyExtractor={({ matchID }, index) => matchID}
                    renderItem={({ item }) => (
                        <ArticleComponent key={item.matchID} item={item} onClick={onClick} />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                    }
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
});
