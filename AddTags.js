import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Image
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import TagInput from 'react-native-tag-input';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class AddTags extends Component {
  cancelAddingTags(){
    this.props.navigator.pop();
  }

  tagsChanged(){

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
        <KeyboardAvoidingView behavior='position'>
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
          <ScrollView
            keyboardDismissMode='interactive'
          >
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
              margin: 30,
              borderRadius: 5,
            }}>
              {
                selectedImages[1] ? (
                  <View style={{
                    position: 'absolute',
                    marginTop: 10,
                    marginLeft: 10,
                    opacity: 0.5,
                  }}>
                    <Image 
                      source={{
                        uri: selectedImages[1].uri
                      }}
                      style={{
                        width: width-60, 
                        height: width-60,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                ) : (null)
              }
              {
                selectedImages[0] ? (
                  <View style={{
                    position: 'absolute',
                    marginTop: -5,
                    marginLeft: -10,
                    opacity: 0.8,
                  }}>
                    <Image 
                      source={{
                        uri: selectedImages[0].uri
                      }}
                      style={{
                        width: width-60, 
                        height: width-60,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                ) : (null)
              }
              <View style={{
                opacity: 1,
              }}>
                <Image 
                  source={{uri: imageUri}} 
                  style={{
                    width: width-60, 
                    height: width-60,
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
            <TagInput
              value={[
                'Tag 1',
                'Tag 2',
                'Tag 3',
                'Tag 4',
                'Tag 5',
              ]}
              onChange={ this.tagsChanged.bind(this) }
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    height: height
  },
  cameraRoll: {
    paddingTop: 70
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 44,
    paddingHorizontal: 10,
  },
});

