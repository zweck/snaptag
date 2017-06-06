import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  ListView,
  Animated,
  Easing,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'react-native-blur';
import NavigationBar from './NavigationBar';

import CameraRollPicker from './CameraRollPicker';
import ImageView from './ImageView';
import AddTags from './AddTags';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class InitialView extends Component {
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.animatedValue = new Animated.Value(1);
 
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      isSelectable: false,
      selectedImages: [],
      current: {},
      showResultsView: false,
      tags: [],
      appliedTags: [],
      viewHidden: true,
    };
  }

  slide(){
    Animated.timing(
      this.animatedValue,
      {
        toValue: this.animatedValue._value === 1 ? 0 : 1,
        duration: 300
      }
    ).start();
    this.setState({ viewHidden: !this.state.viewHidden });
  }

  componentDidMount(){
    this.getTagsFromStore();
  }

  addToFilter(newTag){
    let { appliedTags } = this.state;
    if(appliedTags.some( appliedTag => appliedTag === newTag )){
      appliedTags = Array.from(appliedTags).filter( appliedTag => appliedTag !== newTag );
    }else{
      appliedTags.push(newTag);
    }

    this.setState({ appliedTags }, () => {
      let images = this.props.realm.objects('Image');
      let filteredImages = Array.from(images).filter(image => 
        appliedTags.every( appliedTag => image.tags.some( tag => appliedTag === tag.name ) )
      );
      this.setState({
        dataSource: this.ds.cloneWithRows( filteredImages )
      });
    });

  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    let images = this.props.realm.objects('Image');
    let tagCount = images.reduce( (topTags, image) => {
      Array.from(image.tags).forEach( tag => (
        topTags[tag.name] ? topTags[tag.name] = topTags[tag.name]+1 : topTags[tag.name] = 1
      ));
      return topTags;
    }, {});

    tags.forEach( tag => {
      if( !tagCount.hasOwnProperty(tag.name) ) tagCount[tag.name] = 0;
    });

    tags = Object.keys(tagCount).sort((a,b) => tagCount[b]-tagCount[a]);
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
    
    // if the images object isnt an array it means it's not come
    // from the camera roll but from a filtered list so needs 
    // to be dropped into an array
    if(!Array.isArray(images)) {
      let { selectedImages } = this.state;
      selectedImages.find( img => img.uri === images.uri ) ? selectedImages = selectedImages.filter( img => img.uri !== images.uri ) : selectedImages.push( images );
      images = selectedImages;
    }

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
      selectedImages,
      appliedTags,
      viewHidden,
    } = this.state;

    let rightButtonConfig = this.state.isSelectable ? {
      title: 'Manage',
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

    const animatedBottom = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -height/1.55]
    });

    let numberOfTagsToShow = viewHidden ? 3 : tags.length;

    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            style: 'light-content'
          }}
          style={{
            height: 50,
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
          position: 'absolute',
          top: 0,
          bottom: 0,
          zIndex: -1,
          height: height+50,
          width: width,
          overflow: 'hidden',
          backgroundColor: '#000',
        }}>
          <View style={{
            flex: 1,
          }}>
            {
              appliedTags.length ? (
                <ListView
                  enableEmptySections
                  dataSource={this.state.dataSource}
                  contentContainerStyle={{
                    paddingTop: 60,
                    paddingBottom: 200,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  }}
                  renderRow={( image, i ) => (
                    <TouchableOpacity
                      key={i} 
                      style={{
                        marginBottom: 3, 
                        marginRight: 3,
                        borderColor: '#3FD774',
                        borderWidth: selectedImages.find( img => img.uri === image.uri ) ? 8 : 0,
                      }}
                      onPress={() => this.getSelectedImages(image)}
                    >
                      <Image 
                        source={{uri: image.uri}} 
                        style={{
                          width: selectedImages.find( img => img.uri === image.uri ) ? (width/3)-19 : (width/3)-3,
                          height: selectedImages.find( img => img.uri === image.uri ) ? (width/3)-19 : (width/3)-3,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
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
        </View>
        <Animated.View 
          style={{ 
            flex: 1,
            position: 'absolute',
            bottom: animatedBottom,
            left: 0,
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
              paddingBottom: 80,
              height: height-height/4, 
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <TouchableOpacity 
              style={{ 
                position: 'absolute', 
                right: 10, 
                top: 10 
              }}
              onPress={ () => this.slide() }
            >
            {
              viewHidden ? (
                <Icon name="ios-arrow-dropup-circle" style={{ color: '#0BD318' }} size={40} />
              ) : (
                <Icon name="ios-arrow-dropdown-circle" style={{ color: '#0BD318' }} size={40} />
              )
            }
            </TouchableOpacity>
            {
              tags.map( (tag, i) => i < numberOfTagsToShow ? (
                <TouchableOpacity
                  key={ tag }
                  style={{
                    borderRadius: 5,
                    backgroundColor: appliedTags.some( appliedTag => tag === appliedTag ) ? '#5AC8FB' : '#ccc',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    margin: 5
                  }}
                  onPress={() => this.addToFilter(tag)}
                  accessibilityLabel={`Button to remove a tag named ${tag}`}
                >
                  <Text style={{color: '#000'}}>{ tag }</Text>
                </TouchableOpacity>
              ) : (null))
            }
          </BlurView>
        </Animated.View>
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
    paddingTop: 70,
    paddingBottom: 70
  },
});