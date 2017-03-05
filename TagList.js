import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import SearchBar from 'react-native-search-bar';
import NavigationBar from 'react-native-navbar';

export default class snaptag extends Component {

  constructor() {
    super();
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.initialOfferState = [
      'Tag 1', 
      'Tag 2', 
      'Tag 3', 
      'Tag 4', 
      'Tag 5', 
      'Tag 6', 
    ]
    this.state = {
      dataSource: this.ds.cloneWithRows(this.initialOfferState),
    };
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
            title: '+',
            handler: this.closeTags.bind(this)
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

