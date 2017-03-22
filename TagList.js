import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS
} from 'react-native';

import Swipeout from 'react-native-animated-swipeout';
import NavigationBar from 'react-native-navbar';

export default class TagList extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      selectedTagName: null
    };
  }

  getTagsFromStore(){
    let tags = this.props.realm.objects('Tag');
    this.setState({
      dataSource: this.ds.cloneWithRows( tags )
    });
  }

  componentDidMount(){
    this.getTagsFromStore();
  }

  closeTags(){
    this.props.navigator.pop();
  }

  editTag(newName){
    let { selectedTagName } = this.state;
    this.props.realm.write(() => {
      let tags = this.props.realm.objects('Tag');
      let tagToEdit = tags.filtered('name == $0', selectedTagName);
      tagToEdit[0].name = newName;
      this.getTagsFromStore();
    });
  }

  render(){
    let imageUri = this.props.route.selectedImage;

    const swipeoutBtns = (rowData) => ([
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {
          this.props.realm.write(() => {
            let tags = this.props.realm.objects('Tag');
            let tagToDelete = tags.filtered('name == $0', rowData.name);
            this.props.realm.delete(tagToDelete);
            this.getTagsFromStore();
          });
        }
      },
      {
        text: 'Edit',
        backgroundColor: '#5AC8FB',
        onPress: () => {
          this.setState({ selectedTagName: rowData.name });
          AlertIOS.prompt(
            'Edit Tag', 
            null, 
            this.editTag.bind(this), 
            'plain-text', 
            rowData.name
          )
        }
      }
    ]);

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
          rightButton={{
            title: 'Done',
            handler: this.closeTags.bind(this)
          }}
        />
        <View style={{
          flex: 1,
        }}>
          <ListView
            enableEmptySections
            dataSource={this.state.dataSource}
            style={{paddingBottom: 20}}
            renderRow={( rowData ) => (

              <Swipeout autoClose right={swipeoutBtns(rowData)}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  padding: 20,
                  borderTopColor: '#ccc',
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  backgroundColor: '#fff',
                }}>
                  <Text numberOfLines={0} ellipsizeMode='tail'>
                    { rowData.name }
                  </Text>
                </View>
              </Swipeout>

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

