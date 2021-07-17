
// Import React and Component
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, Image, View, SafeAreaView, StyleSheet } from 'react-native';

import { getAccountProviders } from '../api/providers';

const styles = StyleSheet.create({
  tinyLogo: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});

const KeywordsScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAccountProviders()
      .then((response) => setData(response))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            data={data}
            keyExtractor={({ providerID }, index) => providerID}
            renderItem={({ item }) => (
              <View>
              <Image
                style={styles.tinyLogo}
                source={{uri: item.imageUrl}}
              />
              <Text>{item.name}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default KeywordsScreen;