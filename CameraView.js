import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';
import { BlurView } from 'react-native-blur';

class CameraView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <BlurView
            blurType="dark" 
            blurAmount={10} 
            style={styles.capture}
          >
          <Text style={{ color: '#fff', }} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
          </BlurView>
        </Camera>
      </View>
    );
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    borderRadius: 10,
    flex: 0,
    padding: 10,
    margin: 40
  }
});

export default CameraView;