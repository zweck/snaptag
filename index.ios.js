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

const realm = new Realm({schema: [TagSchema]});

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

  constructor(props){
    super(props);
  }

  componentDidMount(){
    // Create Realm objects and write to local storage
    realm.write(() => {
      let tags = realm.objects('Tag');
      realm.delete(tags);

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