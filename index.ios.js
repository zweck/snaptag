/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import CameraRollPicker from 'react-native-camera-roll-picker';

export default class snaptag extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSelectable: false
    };
  }

  toggleSelect(){
    this.setState({ isSelectable: !this.state.isSelectable });
  }

  getSelectedImages(images, current){
    console.log(images, current)
  }

  render() {
    let rightButtonTitle = this.state.isSelectable ? 'Add Tags' : 'Select';
    let leftButtonTitle = this.state.isSelectable ? 'Cancel' : '#';
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={'transparent'}
          title={{
            title: 'All Photos'
          }}
          rightButton={{
            title: rightButtonTitle,
            handler: this.toggleSelect.bind(this)
          }}
        />
        <View style={{
          flex: 1,
        }}>
          <CameraRollPicker
            callback={this.getSelectedImages}
            imagesPerRow={ 2 }
            groupTypes={ 'All' }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cameraRoll: {
    paddingTop: 70
  },
});

AppRegistry.registerComponent('snaptag', () => snaptag);
