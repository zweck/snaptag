import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Swipeout from 'react-native-swipeout';
import NavigationBar from './NavigationBar';

export default class TagList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: props.realm ? props.realm.objects('Tag') : [],
      selectedTagName: null
    };
  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({ tags });
  }

  editTag(selectedTagName){
    AlertIOS.prompt(
      'Edit Tag', 
      null, 
      (newTagName) => {
        this.props.realm.write(() => {
          let tags = this.props.realm.objects('Tag');
          let tagToEdit = tags.filtered('name == $0', selectedTagName);
          tagToEdit[0].name = newTagName;
          this.getTagsFromStore();
        });
      }, 
      'plain-text', 
      selectedTagName
    );
  }

  deleteTag(selectedTagName){
    this.props.realm.write(() => {
      let tags = this.props.realm.objects('Tag');
      let tagToDelete = tags.filtered('name == $0', selectedTagName);
      this.props.realm.delete(tagToDelete);
      this.getTagsFromStore();
    });
  }

  render(){
    return(
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            tintColor: '#000',
            style: 'light-content'
          }}
          style={{
            backgroundColor: 'black',
            position: 'relative',
          }}
          title={{
            title: 'Tags',
            tintColor: 'white'
          }}
        />
        <ScrollView style={{
          flex: 1,
        }}>
          { this.state.tags.map( (tag, i) => (
            <View 
              key={ i }
              style={{
                flex: 1,
                flexDirection: 'row',
                borderTopColor: '#292929',
                borderStyle: 'solid',
                borderTopWidth: 1,
                backgroundColor: '#000',
              }}
            >
              <Text 
                numberOfLines={0} 
                ellipsizeMode='tail'
                style={{ 
                  flex: 1,
                  color: '#fff',
                  padding: 20,
                }} 
              >
                { tag.name } 
              </Text>
              <View
                style={{ 
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: 15,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    borderColor: '#0BD318',
                    borderWidth: 1,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    margin: 5,
                    marginRight: 15,
                  }}
                  onPress={ () => this.editTag(tag.name) }
                  accessibilityLabel='Button to edit a tag'
                >
                  <Text style={{color: '#0BD318'}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    borderColor: 'red',
                    borderWidth: 1,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    margin: 5
                  }}
                  onPress={ () => this.editTag(tag.name) }
                  accessibilityLabel='Button to edit a tag'
                >
                  <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )) }
        </ScrollView>
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

