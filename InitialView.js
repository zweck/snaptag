import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import SearchBar from 'react-native-search-bar';

import CameraRollPicker from './CameraRollPicker';
import ImageView from './ImageView';
import AddTags from './AddTags';
import TagList from './TagList';

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
    };
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
      appliedTags
    } = this.state;

    let rightButtonConfig = this.state.isSelectable ? {
      title: 'Add Tags',
      handler: this.openAddTagModal.bind(this)
    } : {
      title: 'Select',
      handler: this.toggleSelect.bind(this)
    }
  
    let leftButtonConfig = this.state.isSelectable ? {
      title: 'Cancel',
      tintColor: 'red',
      handler: this.openTags.bind(this)
    } : {
      title: '    #    ',
      handler: this.openTags.bind(this)
    }
  
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
          rightButton={ rightButtonConfig }
          leftButton={ leftButtonConfig }
        />
        <SearchBar
          ref='searchBar'
          placeholder='Search Photos'
          onFocus={ this.toggleResultsView.bind(this) }
          onBlur={ this.toggleResultsView.bind(this) }
        />
        {
          showResultsView ? (
              <View style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                backgroundColor: 'white',
                borderRadius: 5,
                borderColor: '#ccc',
                borderWidth: 1,
                margin: 10,
              }}>
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
                      <Text style={{color: '#fff'}}>{ tag.name }</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
          ) : (null)
        }
        <View style={{
          flex: 1,
          marginTop: -15,
          position: 'relative',
          zIndex: -1
        }}>
          <CameraRollPicker
            callback={this.getSelectedImages.bind(this)}
            imagesPerRow={ 3 }
            selected={this.state.selectedImages}
            imageMargin={ 5 }
            backgroundColor={ '#f0f0f0' }
            maximum={ 100 }
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