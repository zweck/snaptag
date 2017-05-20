import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS
} from 'react-native';

import Swipeout from 'react-native-swipeout';
import NavigationBar from './NavigationBar';

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
        <View style={{
          flex: 1,
        }}>
          <ListView
            enableEmptySections
            dataSource={this.state.dataSource}
            style={{paddingBottom: 20,}}
            renderRow={( rowData ) => (

              <Swipeout 
                style={{ 
                  backgroundColor: '#000',
                  borderBottomColor: '#292929',
                  borderStyle: 'solid',
                  borderBottomWidth: 1,
                }} 
                autoClose 
                right={swipeoutBtns(rowData)}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  padding: 20,
                  borderTopColor: '#292929',
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  backgroundColor: '#000',
                }}>
                  <Text style={{ color: '#fff' }} numberOfLines={0} ellipsizeMode='tail'>
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
    backgroundColor: '#000',
  },
  cameraRoll: {
    paddingTop: 70
  },
});

