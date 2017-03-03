import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class snaptag extends Component {
  closeImage(){
    this.props.navigator.pop();
  }

  render(){
    let imageUri = this.props.route.selectedImage;
    return(
      <View style={styles.container}>
        <NavigationBar
          tintColor={'transparent'}
          title={{
            title: 'Image'
          }}
          leftButton={{
            title: 'Done',
            handler: this.closeImage.bind(this)
          }}
        />
        <View style={{
          flex: 1,
        }}>
        <Image source={{uri: imageUri}} style={{width: 400, height: 400}} />
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

