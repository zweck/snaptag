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

export default class AddTags extends Component {
  cancelAddingTags(){
    this.props.navigator.pop();
  }

  render(){

    let {
      selectedImages,
      current
    } = this.props.route;

    let imageUri = current.uri;
    let imageCount = selectedImages.length;
    let titleConfig = {
      title: `Tag ${imageCount} images`
    }
    return(
      <View style={styles.container}>
        <NavigationBar
          style={{
            borderBottomColor: 'rgba(150,150,150,0.3)',
            borderStyle: 'solid',
            borderBottomWidth: 1,
            position: 'relative',
          }}
          title={ titleConfig }
          leftButton={{
            title: 'Cancel',
            tintColor: 'red',
            handler: this.cancelAddingTags.bind(this)
          }}
        />
        <View style={{
          position: 'relative',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 3,
          shadowOpacity: 0.2,
          width: width-60, 
          height: width-60,
          marginTop: 30,
          marginLeft: 10,
          marginRight: 30,
          marginBottom: 30,
          borderRadius: 10,
        }}>
        <View style={{
          opacity: 0.5,
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
        {
          selectedImages[1] ? (
            <View style={{
              position: 'absolute',
              marginTop: 10,
              marginLeft: 10,
              opacity: 0.8,
            }}>
              <Image 
                source={{
                  uri: selectedImages[1].uri
                }}
                style={{
                  width: width-60, 
                  height: width-60,
                  borderRadius: 10,
                }}
              />
            </View>
          ) : (null)
        }
        {
          selectedImages[2] ? (
            <View style={{
              position: 'absolute',
              marginTop: 20,
              marginLeft: 20,
            }}>
              <Image 
                source={{
                  uri: selectedImages[2].uri
                }}
                style={{
                  width: width-60, 
                  height: width-60,
                  borderRadius: 10,
                }}
              />
            </View>
          ) : (null)
        }
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

