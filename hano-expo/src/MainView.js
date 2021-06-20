import React from 'react';
import { DefaultTheme, BottomNavigation } from 'react-native-paper';
import { Text } from 'react-native';

//--------------
import ArticlesView from './ArticlesView';

const DiscoverRoute = () => <Text>Discover</Text>;
const SavedRoute = () => <Text>Articles</Text>;
const KeywordsRoute = () => <Text>Keywords</Text>;
const HistoryRoute = () => <Text>History</Text>;
//--------------

export default function MainView(props) {
  const [index, setIndex] = React.useState(2);
  const [routes] = React.useState([
    { key: 'discover', title: 'Discover', icon: 'star-four-points-outline' },
    { key: 'saved', title: 'Saved', icon: 'bookmark-outline' },
    { key: 'articles', title: 'Articles', icon: 'newspaper-variant-outline' },
    { key: 'keywords', title: 'Keywords', icon: 'comment-quote-outline' },
    { key: 'history', title: 'History', icon: 'history' },
  ]);
  routes[2].badge = 3;

  const renderScene = BottomNavigation.SceneMap({
    discover: DiscoverRoute,
    saved: SavedRoute,
    articles: ArticlesView,
    keywords: KeywordsRoute,
    history: HistoryRoute,
  });

  return (
    <BottomNavigation theme={navTheme}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'white'
  },
};
