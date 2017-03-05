import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';

import NavigationBar from 'react-native-navbar';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class snaptag extends Component {
  closeImage(){
    this.props.navigator.pop();
  }

  render(){
    let imageUri = this.props.route.selectedImage;
    return(
      <View style={styles.container}>
        <NavigationBar
          style={{
            borderBottomColor: 'rgba(150,150,150,0.3)',
            borderStyle: 'solid',
            borderBottomWidth: 1,
            position: 'relative',
          }}
          title={{
            title: 'Image'
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
            borderRadius: 15,
            // margin: 30,
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
    backgroundColor: '#F5FCFF',
  },
  cameraRoll: {
    paddingTop: 70
  },
});

