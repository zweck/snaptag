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
  PanResponder,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'react-native-blur';
import NavigationBar from './NavigationBar';

import CameraRollPicker from './CameraRollPicker';
import ImageView from './ImageView';
import AddTags from './AddTags';
import Modal from './Modal';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const SLIDEOUT_PEEK = height/1.55

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
      gestureUp: -SLIDEOUT_PEEK,
      isPanning: false,
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => (gestureState.dy !== 0 ? true : false),
      onStartShouldSetPanResponderCapture: (evt, gestureState) => (gestureState.dy !== 0 ? true : false),
      onMoveShouldSetPanResponder: (evt, gestureState) => (gestureState.dy !== 0 ? true : false),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => (gestureState.dy !== 0 ? true : false),
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        this.setState({ isPanning: true });
      },
      onPanResponderMove: ({target}, gestureState) => {
        const swipingUp = gestureState.dy > 0;
        if( (this.state.viewHidden && swipingUp) || (!this.state.viewHidden && !swipingUp) ) return false;
        let gestureUp = swipingUp ? 0-gestureState.dy : -gestureState.dy-SLIDEOUT_PEEK;
        this.setState({ gestureUp });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        let viewHidden = this.state.viewHidden;
        let absSlideOutPeek =  Math.abs(SLIDEOUT_PEEK);
        let absGestureUp = Math.abs(this.state.gestureUp);
        let gestureUp = viewHidden ? -absSlideOutPeek : 0;

        if( this.state.viewHidden && (absGestureUp < absSlideOutPeek-(absSlideOutPeek/6)) ) {
          gestureUp = 0;
          viewHidden = false;
        }

        if(!this.state.viewHidden && (absGestureUp > Math.abs(SLIDEOUT_PEEK)/6)) {
          gestureUp = -SLIDEOUT_PEEK;
          viewHidden = true;
        }
        this.setState({ isPanning: false, gestureUp, viewHidden });
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
    });
  }

  slide(){
    this.setState({ viewHidden: !this.state.viewHidden, gestureUp: this.state.viewHidden ? 0 : -SLIDEOUT_PEEK });
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

    const animatedBottom = this.state.gestureUp;

    let numberOfTagsToShow = viewHidden ? 3 : tags.length;

    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            style: 'light-content'
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
                    paddingTop: 50,
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
                          width: selectedImages.find( img => img.uri === image.uri ) ? (width/4)-19 : (width/4)-3,
                          height: selectedImages.find( img => img.uri === image.uri ) ? (width/4)-19 : (width/4)-3,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <CameraRollPicker
                  callback={this.getSelectedImages.bind(this)}
                  imagesPerRow={ 4 }
                  selected={this.state.selectedImages}
                  imageMargin={ 3 }
                  maximum={ 10000 }
                />
              )
            }
          </View>
        </View>
        <View 
          style={{ 
            flex: 1,
            position: 'absolute',
            bottom: animatedBottom,
            left: 0,
            width: width,
          }}
          {...this._panResponder.panHandlers}
        >
          <BlurView 
            blurType="dark" 
            blurAmount={10} 
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingTop: 10,
              paddingBottom: 80,
              height: height-height/4, 
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                paddingRight: 50,
                paddingLeft: 6,
              }}
            >
              {
                tags.map( (tag, i) => i < numberOfTagsToShow ? (
                  <TouchableOpacity
                    key={ tag }
                    style={{
                      borderRadius: 10,
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
            </ScrollView>
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
          </BlurView>
        </View>
        <Modal>
          
        </Modal>
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