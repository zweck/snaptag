import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import InitialView from './InitialView';

function renderScene(route, navigator) {
  return <route.component route={route} navigator={navigator} />;
}

function configureScene(route, routeStack){
  if(route.type === 'Modal') {
    return Navigator.SceneConfigs.FloatFromBottom
  }
  if(route.type === 'SlideFromLeft') {
    return Navigator.SceneConfigs.FloatFromLeft
  }
  return Navigator.SceneConfigs.PushFromRight 
}


class Snaptag extends Component {
  render() {
    const initialRoute = {
      component: InitialView
    };

    return (
      <View style={{ flex: 1, }}>
        <Navigator
          initialRoute={initialRoute}
          renderScene={renderScene}
          configureScene={configureScene}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('snaptag', () => Snaptag);