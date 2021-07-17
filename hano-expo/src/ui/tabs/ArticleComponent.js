import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, Chip } from 'react-native-paper';

export default function ArticleComponent({ item, onClick, ...rest }) {
    const keywordChips = item => item.keywords.map(keyword => (
        <Chip key={keyword} mode='flat'>{keyword}</Chip>));

    return (
        <Card style={styles.card} onPress={() => { onClick(item); }}>
            <Card.Title title={item.title} subtitle={item.author} />
            <Card.Content>
                <Text>{item.description}</Text>
                <View style={styles.chips}>{keywordChips(item)}</View>
                <Text style={{ fontWeight: 'bold' }}>{item.confidence}%</Text>
                <Text>{item.pubDate}</Text>
                <Text>{item.url}</Text>
            </Card.Content>
            <Card.Actions>
                <Button>Archive</Button>
            </Card.Actions>
        </Card>
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
    chips: {
        flexDirection: 'row',
    }
});
