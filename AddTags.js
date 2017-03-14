import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Button,
  AlertIOS
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import changeCase from 'change-case';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class AddTags extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags: [],
      appliedTags: []
    }
  }

  cancelAddingTags(){
    this.props.navigator.pop();
  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({
      tags: (
        tags.reduce((flatTags, tag) => {
          flatTags.push(tag.name);
          return flatTags;
        }, [])
      )
    });
  }

  componentDidMount(){
    this.getTagsFromStore();
  }

  toggleTag(tag){
    let { appliedTags } = this.state;

    if(appliedTags.indexOf(tag) > -1){
      appliedTags.splice(appliedTags.indexOf(tag), 1);
    }else{
      appliedTags.push(tag);
    }

    this.setState({ appliedTags });
  }

  addNewTag(tag){
    this.props.realm.write(() => {
      let tags = this.props.realm.objects('Tag');
      this.props.realm.create('Tag', { name: tag });
    });
    this.getTagsFromStore();
  }

  render(){

    let {
      tags
    } = this.state;

    let {
      selectedImages,
      current
    } = this.props.route;

    tags = tags || [];

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
            <View style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 5,
              borderColor: '#ccc',
              borderWidth: 1,
              margin: 10,
              overflow: 'hidden'
            }}>
              <Text style={{
                  color: '#ccc',
                  borderStyle: 'solid',
                  borderBottomColor: '#eee',
                  borderBottomWidth: 1,
                }}
              > Select tags to add </Text>
              <View style={{
                flex: 1,
                flexDirection: 'row',
              }}>
                <Button
                  color='#0BD318'
                  onPress={() => (
                    AlertIOS.prompt(
                      'Add New Tag',
                      null,
                      this.addNewTag.bind(this)
                    ))
                  }
                  title='Add New'
                  accessibilityLabel='Button to add a new tag'
                />
                {
                  tags.map( tag => (
                    <Button
                      color={ this.state.appliedTags.indexOf(tag) > -1 ? '#007AFF' : '#ccc' }
                      key={tag}
                      onPress={() => this.toggleTag(tag)}
                      title={tag}
                      accessibilityLabel={`Button to remove a tag named ${tag}`}
                    />
                  ))
                }
              </View>
            </View>
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

