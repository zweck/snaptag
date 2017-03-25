import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';

import NavigationBar from './NavigationBar';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class ImageView extends Component {
  closeImage(){
    this.props.navigator.pop();
  }

  render(){
    let imageUri = this.props.route.currentUri;
    return(
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            style: 'light-content'
          }}
          style={{
            height: 50,
          }}
          title={{
            title: 'Image',
            tintColor: 'white'
          }}
          leftButton={{
            title: 'Done',
            handler: this.closeImage.bind(this)
          }}
        />
        <View style={{
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 3,
          shadowOpacity: 0.2,
          width: width-60, 
          height: width-60,
          margin: 30,
          borderRadius: 15,
        }}>
        <Image 
          source={{uri: imageUri}} 
          style={{
            width: width-60, 
            height: width-60,
            borderRadius: 10,
          }}
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraRoll: {
    paddingTop: 70
  },
});

