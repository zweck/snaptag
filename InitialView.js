import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import SearchBar from 'react-native-search-bar';

import CameraRollPicker from './CameraRollPicker';
import ImageView from './ImageView';
import TagList from './TagList';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class InitialView extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSelectable: false,
      selectedImages: []
    };
  }

  toggleSelect(){
    this.setState({ isSelectable: !this.state.isSelectable });
  }

  getSelectedImages(images, current){
    // console.log(images, current);
    this.setState({ selectedImages: images });
    if(!this.state.isSelectable){
      this.setState({ selectedImages: [] });
      this.props.navigator.push({
        component: ImageView,
        type: 'Modal',
        selectedImage: current.uri
      });
    }
  }

  openTags(){
    if(!this.state.isSelectable){
      this.props.navigator.push({
        component: TagList,
        type: 'SlideFromLeft',
      });
    }else{
      this.setState({ selectedImages: [] });
      this.setState({ isSelectable: !this.state.isSelectable });
    }
  }

  render() {
    let rightButtonTitle = this.state.isSelectable ? 'Add Tags' : 'Select';
    let leftButtonTitle = this.state.isSelectable ? 'Cancel' : '#';
    return (
      <View style={styles.container}>
        <NavigationBar
          style={{
            borderBottomColor: 'rgba(150,150,150,0.3)',
            borderStyle: 'solid',
            borderBottomWidth: 1,
            position: 'relative',
            zIndex: 2
          }}
          title={{
            title: 'All Photos'
          }}
          rightButton={{
            title: rightButtonTitle,
            handler: this.toggleSelect.bind(this)
          }}
          leftButton={{
            title: leftButtonTitle,
            handler: this.openTags.bind(this)
          }}
        />
        <SearchBar
          ref='searchBar'
          placeholder='Search Photos'
        />
        <View style={{
          flex: 1,
          marginTop: -15,
          position: 'relative',
          zIndex: -1
        }}>
          <CameraRollPicker
            callback={this.getSelectedImages.bind(this)}
            imagesPerRow={ 2 }
            groupTypes={ 'All' }
            selected={this.state.selectedImages}
            imageMargin={ 15 }
            backgroundColor={ '#f0f0f0' }
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