import React from 'react';
import { DefaultTheme, BottomNavigation } from 'react-native-paper';
import { Text, View } from 'react-native';

//--------------
import ArticlesView from './tabs/ArticlesView';
import KeywordsScreen from '../t/KeywordsScreen';

import { useDispatch, useSelector } from 'react-redux';
import { refreshArticles } from '../model/action';

export default function MainView(props) {
  // Load articles on start
  const dispatch = useDispatch();
  React.useEffect(() => refreshArticles(dispatch), []);
  const articles = useSelector(state => state.articles);

  // Set routes
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    // { key: 'discover', title: 'Discover', icon: 'star-four-points-outline' },
    // { key: 'saved', title: 'Saved', icon: 'bookmark-outline' },
    { key: 'articles', title: 'Articles', icon: 'newspaper-variant-outline' },
    // { key: 'history', title: 'History', icon: 'history' },
    { key: 'keywords', title: 'Keywords', icon: 'comment-quote-outline' },
  ]);

  // update badge
  // routes[2].badge = articles.filter(x => !x.seen && x.confidence > 30).length;

  const renderScene = BottomNavigation.SceneMap({
    // discover: DiscoverRoute,
    // saved: BookmarkedView,
    articles: ArticlesView,
    // history: HistoryView,
    keywords: KeywordsScreen,
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
