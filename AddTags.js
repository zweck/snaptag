import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  Button,
  AlertIOS,
  TouchableOpacity,
  ActionSheetIOS,
  NativeModules
} from 'react-native';

import RNPhotosFramework from 'react-native-photos-framework';
import changeCase from 'change-case';
import ActivityView from 'react-native-activity-view';

import NavigationBar from './NavigationBar';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class AddTags extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags: [],
      appliedTags: [],
      appliedTagsCloned: []
    }
  }

  dismissModal(){
    this.props.navigator.pop();
  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({ tags });
  }

  setTagsOnState(){
    let storedImages = this.props.realm.objects('Image');
    let current = this.props.route.selectedImages[0];
    let currentImageFromStore = storedImages.filtered(`uri = "${current.uri}"`);
    if(currentImageFromStore[0] && this.props.route.selectedImages.length === 1){
      this.setState({ appliedTags: currentImageFromStore[0].tags });
    }
  }

  componentDidMount(){
    this.getTagsFromStore();
    if(!this.props.current){
      this.setTagsOnState();
    }
  }

  imageHasTag({ imageFromStore, tag }){
    return Object.keys(imageFromStore).some(image => {
      return Object.keys(imageFromStore[image].tags).some( imageTag => {
        return imageFromStore[image].tags[imageTag].name === tag.name;
      });
    });
  }

  applyTags(){
    this.props.realm.write(() => {

      let { appliedTags } = this.state;

      let images = this.props.realm.objects('Image');
      let tags = this.props.realm.objects('Tag');
      this.props.route.selectedImages.forEach( ({ uri }) => {
        let imageFromStore = images.filtered(`uri = "${ uri }"`);
        if( !Object.keys(imageFromStore).length ) {
          this.props.realm.create('Image', { uri, tags: appliedTags });
        }else{
          imageFromStore['0'].tags = tags.reduce( (tagToSetToImage, nextTag, index) => {
            let tagToAdd = appliedTags.find( appliedTag => appliedTag.name === nextTag.name )
            if(tagToAdd) tagToSetToImage.push(tagToAdd);
            return tagToSetToImage
          }, []);
        }
      });
    });

    this.dismissModal();
  }

  toggleTag(newTag){
    this.props.realm.write(() => {

      let { appliedTags } = this.state;

      if(appliedTags.some( appliedTag => appliedTag.name === newTag.name )){
        appliedTags = Array.from(appliedTags).filter( appliedTag => appliedTag.name !== newTag.name );
      }else{
        appliedTags.push(newTag);
      }

      this.setState({ appliedTags });
    });
  }

  addNewTag(tag){
    this.props.realm.write(() => {
      let tags = this.props.realm.objects('Tag');
      this.props.realm.create('Tag', { name: tag });
    });
    this.getTagsFromStore();
  }

  shareImage(){
    let {
      selectedImages,
      current
    } = this.props.route;
    current = current || selectedImages[0];
    let imageUri = current.uri;

    ActivityView.show({
      imageUrl: imageUri
    });
  }

  deleteImage(){
    let { current, selectedImages } = this.props.route;
    let removeArray = current ? [current] : [];
    RNPhotosFramework.deleteAssets(selectedImages)
    .then( () => this.dismissModal());
  }

  render(){

    let {
      tags,
      appliedTags
    } = this.state;

    let {
      selectedImages,
      current
    } = this.props.route;

    current = current || selectedImages[0];

    tags = tags || [];

    let imageUri = current.uri;
    let imageCount = selectedImages.length ? selectedImages.length : 1;
    let titleConfig = {
      title: `Tag ${imageCount} image${ selectedImages.length > 1 ? 's' : '' }`,
      tintColor: 'white',
    }

    return(
      <View style={styles.container}>
        <View behavior='position'>
          <NavigationBar
            statusBar={{
              style: 'light-content'
            }}
            style={{
              height: 50,
            }}
            title={ titleConfig }
            leftButton={{
              title: 'Cancel',
              tintColor: 'red',
              handler: this.dismissModal.bind(this)
            }}
            rightButton={{
              title: 'Done',
              handler: this.applyTags.bind(this)
            }}
          />
          <ScrollView>
            <View style={{
              position: 'relative',
              width: width, 
            }}>
              <View style={{
                opacity: 1,
              }}>
                <Image 
                  source={{uri: imageUri}} 
                  style={{
                    width: width, 
                    height: width,
                  }}
                />
              </View>
            </View>
            <View style={{
              flex: 1,
              margin: 10,
            }}>
              <Text style={{
                  color: '#ccc',
                  borderStyle: 'solid',
                }}
              > Select tags to add </Text>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
              }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    backgroundColor: '#0BD318',
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    margin: 5
                  }}
                  onPress={() => (
                    AlertIOS.prompt(
                      'Add New Tag',
                      null,
                      this.addNewTag.bind(this)
                    ))
                  }
                  accessibilityLabel='Button to add a new tag'
                >
                  <Text style={{color: '#000'}}>Add New</Text>
                </TouchableOpacity>
                {
                  tags.map( tag => (
                    <TouchableOpacity
                      key={ tag.name }
                      style={{
                        borderRadius: 5,
                        backgroundColor: appliedTags.some( appliedTag => tag.name === appliedTag.name ) ? '#5AC8FB' : '#ccc',
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 10,
                        paddingRight: 10,
                        margin: 5
                      }}
                      onPress={() => this.toggleTag(tag)}
                      accessibilityLabel={`Button to remove a tag named ${tag.name}`}
                    >
                      <Text style={{color: '#000'}}>{ tag.name }</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }}
          >
            <TouchableOpacity
              style={{
                width: (width/2)-30,
                height: 30,
                borderRadius: 8,
                overflow: 'hidden',
                margin: 15,
                backgroundColor: '#5AC8FB',
              }}
              onPress={ this.shareImage.bind(this) }
            >
              <Text style={{ 
                color: '#000',
                height: 30,
                padding: 8,
                width: (width/2)-30,
                textAlign: 'center', 
              }}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: (width/2)-30,
                height: 30,
                borderRadius: 8,
                overflow: 'hidden',
                margin: 15,
                backgroundColor: 'red',
              }}
              onPress={ this.deleteImage.bind(this) }
            >
              <Text style={{ 
                color: '#000',
                height: 30,
                padding: 8,
                width: (width/2)-30,
                textAlign: 'center', 
              }}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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

