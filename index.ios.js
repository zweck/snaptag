import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View
} from 'react-native';
import { TabViewAnimated, TabBar, TabViewPagerPan } from 'react-native-tab-view';

import NavigationBar from './NavigationBar';
import InitialView from './InitialView';
import CameraView from './CameraView';
import TagList from './TagList';

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

  state = {
    index: 1,
    routes: [
      { key: '1', title: 'Camera' },
      { key: '2', title: 'Photos' },
      { key: '3', title: '    #    ' },
    ],
  }

  componentDidMount(){
    // Create Realm objects and write to local storage
    realm.write(() => {
      let tags = realm.objects('Tag');
      if(tags.length === 0){
        realm.create('Tag', { name: 'Family' });
        realm.create('Tag', { name: 'Vacation' });
        realm.create('Tag', { name: 'Junk' });
      }
    });
  }

  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        style={styles.tabbar}
        indicatorStyle={styles.indicator}
        tabStyle={styles.tab}
      />
    );
  }

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <CameraView realm={ realm } />;
      case '2':
        const initialRoute = {
          component: InitialView
        };

        return (
          <View style={{ 
            flex: 1, 
          }}>
            <Navigator
              initialRoute={initialRoute}
              renderScene={renderScene}
              configureScene={configureScene}
            />
          </View>
        )
      case '3':
        return ( <TagList realm={ realm }/> )
      default:
        return null;
    }
  }

  _renderPager(props){
    return(
      <TabViewPagerPan
        { ...props }
        lazy
        swipeDistanceThreshold={300}
        swipeVelocityThreshold={0.5}
      />
    )
  }

  _handleChangeTab = (index) => {
    this.setState({
      index,
    });
  }

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderFooter={this._renderFooter}
        onRequestChangeTab={this._handleChangeTab}
        renderPager={ this._renderPager }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#000',
  },
  tab: {
    padding: 0,
  },
  indicator: {
    backgroundColor: '#5AC8FB',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('snaptag', () => Snaptag);