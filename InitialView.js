import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { BlurView } from 'react-native-blur';
import NavigationBar from 'react-native-navbar';
import SearchBar from 'react-native-search-bar';

import CameraRollPicker from './CameraRollPicker';
import ImageView from './ImageView';
import AddTags from './AddTags';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class InitialView extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSelectable: false,
      selectedImages: [],
      current: {},
      showResultsView: false,
      tags: [],
      appliedTags: [],
      filteredImages: [],
    };
  }

  componentDidMount(){
    this.getTagsFromStore();
  }

  addToFilter(newTag){
    let { appliedTags } = this.state;
    if(appliedTags.some( appliedTag => appliedTag.name === newTag.name )){
      appliedTags = Array.from(appliedTags).filter( appliedTag => appliedTag.name !== newTag.name );
    }else{
      appliedTags.push(newTag);
    }

    this.setState({ appliedTags }, () => {
      let images = this.props.realm.objects('Image');
      let filteredImages = Array.from(images).filter(image => 
        appliedTags.every( appliedTag => image.tags.some( tag => appliedTag.name === tag.name ) )
      );
      this.setState({ filteredImages });
    });

  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({ tags });
  }

  toggleSelect(){
    this.setState({ isSelectable: !this.state.isSelectable });
  }

  toggleResultsView(){
    if(!this.state.showResultsView){
      this.getTagsFromStore();
    }
    this.setState({ showResultsView: !this.state.showResultsView });
  }

  getSelectedImages(images, current){
    if(!current) current = Array.isArray(images) ? images[0] : images;
    this.setState({ selectedImages: images, current });
    if(!this.state.isSelectable){
      this.setState({ selectedImages: [] });
      this.props.navigator.push({
        component: AddTags,
        type: 'Modal',
        selectedImages: [current]
      });
    }
  }

  cancelSelection(){
    this.setState({ selectedImages: [] });
    this.setState({ isSelectable: !this.state.isSelectable });
  }

  openAddTagModal(){
    if(this.state.selectedImages.length){
      this.props.navigator.push({
        component: AddTags,
        type: 'Modal',
        current: this.state.current,
        selectedImages: this.state.selectedImages
      });
    }
  }

  render() {
    let {
      showResultsView,
      tags,
      appliedTags,
      filteredImages
    } = this.state;

    let rightButtonConfig = this.state.isSelectable ? {
      title: 'Add Tags',
      tintColor: '#5AC8FB',
      handler: this.openAddTagModal.bind(this)
    } : null;
  
    let leftButtonConfig = this.state.isSelectable ? {
      title: 'Cancel',
      tintColor: 'red',
      handler: this.cancelSelection.bind(this)
    } : {
      title: 'Select',
      tintColor: '#5AC8FB',
      handler: this.toggleSelect.bind(this)
    };

    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            tintColor: '#000',
            style: 'light-content'
          }}
          style={{
            backgroundColor: '#000',
            position: 'relative',
            zIndex: 2
          }}
          title={{
            title: 'All Photos',
            tintColor: 'white'
          }}
          rightButton={ rightButtonConfig }
          leftButton={ leftButtonConfig }
        />
        <View style={{
          flex: 1,
          marginTop: 15,
          position: 'relative',
          borderRadius: 10,
          overflow: 'hidden',
          zIndex: -1,
          backgroundColor: '#000',
        }}>
          <View style={{
            flex: 1,
          }}>
            {
              appliedTags.length ? (
                <ScrollView
                  style={{
                    flex: 1,
                  }}
                >

                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  }}>

                    {
                      filteredImages.map( (image, i) => (
                        <TouchableOpacity
                          key={i} 
                          style={{marginBottom: 3, marginRight: 3}}
                          onPress={() => this.getSelectedImages(image)}>
                          <Image 
                            source={{uri: image.uri}} 
                            style={{
                              width: (width/3)-3,
                              height: (width/3)-3,
                            }}
                          />
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </ScrollView>
              ) : (
                <CameraRollPicker
                  callback={this.getSelectedImages.bind(this)}
                  imagesPerRow={ 3 }
                  selected={this.state.selectedImages}
                  imageMargin={ 3 }
                  maximum={ 10000 }
                />
              )
            }
          </View>
          <ScrollView 
            style={{ 
              maxHeight: height/8, 
              flex: 1,
              position: 'absolute',
              bottom: 0,
              width: width,
            }}
          >
            <BlurView 
              blurType="dark" 
              blurAmount={10} 
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
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
                    onPress={() => this.addToFilter(tag)}
                    accessibilityLabel={`Button to remove a tag named ${tag.name}`}
                  >
                    <Text style={{color: '#000'}}>{ tag.name }</Text>
                  </TouchableOpacity>
                ))
              }
            </BlurView>
          </ScrollView>
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