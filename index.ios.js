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

import store from 'react-native-simple-store';
import Realm from 'realm';

import { TagSchema } from './orm/TagSchema';
import { ImageSchema } from './orm/ImageSchema';

const realm = new Realm({
  schema: [TagSchema, ImageSchema],
  schemaVersion: 1
});

function renderScene(route, navigator) {
  return (
    <route.component 
      realm={ realm }
      route={ route } 
      navigator={ navigator } 
    />
  );
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

  componentDidMount(){
    // Create Realm objects and write to local storage
    realm.write(() => {
      realm.deleteAll();
      let tags = realm.objects('Tag');
      realm.create('Tag', { name: 'Tag1' });
      realm.create('Tag', { name: 'Tag2' });
      realm.create('Tag', { name: 'Tag3' });
    });
  }

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