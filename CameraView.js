import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Camera from 'react-native-camera';
import { CameraKitCamera } from 'react-native-camera-kit';
import { BlurView } from 'react-native-blur';

const { width, height } = Dimensions.get('window');

class CameraView extends Component {

  constructor(props){
    super(props);
    let images = props.realm.objects('Image');
    let tagCount = images.reduce( (topTags, image) => {
      Array.from(image.tags).forEach( tag => (
        topTags[tag.name] ? topTags[tag.name] = topTags[tag.name]+1 : topTags[tag.name] = 1
      ));
      return topTags;
    }, {});

    this.state = {
      topTags: Object.keys(tagCount).sort((a,b) => tagCount[b]-tagCount[a]).splice(0, 3)
    }
  }

  render() {
    let {
      topTags
    } = this.state;
    return (
      <View style={styles.container}>
        <CameraKitCamera
          ref={cam => this.camera = cam}
          style={{
            flex: 1,
            backgroundColor: 'white'
          }}
          cameraOptions={{
            flashMode: 'auto',             // on/off/auto(default)
            focusMode: 'on',               // off/on(default)
            zoomMode: 'on',                // off/on(default)
            ratioOverlay:'1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
            ratioOverlayColor: '#00000077' // optional
          }}
        />
        <View 
          style={{ 
            position: 'absolute',
            bottom: 3,
            flex: 1,
            flexDirection: 'row',
          }}
        >
          {
            topTags.map( (tag, i) => (
              <BlurView
                key={ i }
                blurType="dark" 
                blurAmount={10} 
                style={{
                  width: width/3,
                }}
              >
                <Text 
                  style={{ 
                    textAlign: 'center', 
                    color: '#fff', 
                    padding: 30 
                  }} 
                  onPress={() => this.takePicture(tag)}
                >
                  {tag}
                </Text>
              </BlurView>
            ))
          }
        </View>
        <View 
          style={{ 
            position: 'absolute',
            bottom: 80,
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <BlurView
            blurType="dark" 
            blurAmount={10} 
            style={{
              flex: 1,
            }}
          >
            <Text 
              style={{ 
                textAlign: 'center', 
                color: '#fff', 
                padding: 30 
              }} 
              onPress={() => this.takePicture()}
            >
              Take Without Tag
            </Text>
          </BlurView>
        </View>

      </View>
    );
  }

  takePicture(tag) {
    const options = {};
    this.camera.capture({metadata: options})
    .then(({ mediaUri }) => {
      if( tag ){
        this.props.realm.write(() => {
          let tags = this.props.realm.objects('Tag');
          tags = tags.filtered( 'name = $0', tag );
          this.props.realm.create(
            'Image', 
            { 
              tags,
              uri: mediaUri
            }
          );
        });
      }
    })
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
});

export default CameraView;