import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import CameraRollPicker from 'react-native-camera-roll-picker';

import ImageView from './ImageView';

export default class InitialView extends Component {
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
    this.props.navigator.push({
      component: ImageView,
      type: 'Modal',
      selectedImage: current.uri
    });
  }

  render() {
    let rightButtonTitle = this.state.isSelectable ? 'Add Tags' : 'Select';
    let leftButtonTitle = this.state.isSelectable ? 'Cancel' : '#';
    return (
      <View style={styles.container}>
        <NavigationBar
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
            callback={this.getSelectedImages.bind(this)}
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
    backgroundColor: '#F5FCFF',
  },
  cameraRoll: {
    paddingTop: 70
  },
});