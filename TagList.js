import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS
} from 'react-native';

import SearchBar from 'react-native-search-bar';
import NavigationBar from 'react-native-navbar';

export default class TagList extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    };
  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({
      dataSource: this.ds.cloneWithRows(
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

  addNewTag(tag){
    this.props.realm.write(() => {
      let tags = this.props.realm.objects('Tag');
      this.props.realm.create('Tag', { name: tag });
    });
    this.getTagsFromStore();
  }

  closeTags(){
    this.props.navigator.pop();
  }

  render(){
    let imageUri = this.props.route.selectedImage;
    return(
      <View style={styles.container}>
        <NavigationBar
          style={{
            borderBottomColor: 'rgba(150,150,150,0.3)',
            borderStyle: 'solid',
            borderBottomWidth: 1,
            position: 'relative',
          }}
          title={{
            title: 'Tags'
          }}
          leftButton={{
            title: '  +  ',
            handler: () => (
              AlertIOS.prompt(
                'Add New Tag',
                null,
                this.addNewTag.bind(this)
              )
            )
          }}
          rightButton={{
            title: 'Done',
            handler: this.closeTags.bind(this)
          }}
        />
        <View style={{
          flex: 1,
        }}>
          <SearchBar
            ref='searchBar'
            placeholder='Search Tags'
          />
          <ListView
            enableEmptySections
            dataSource={this.state.dataSource}
            style={{paddingBottom: 20}}
            renderRow={(rowData) => (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 20,
                borderTopColor: '#ccc',
                borderStyle: 'solid',
                borderTopWidth: 1,
              }}>
                <Text>
                  {rowData}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  cameraRoll: {
    paddingTop: 70
  },
});

