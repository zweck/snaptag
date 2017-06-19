import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ListView,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  CameraRoll,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const WINDOW_WIDTH = width;
const WINDOW_HEIGHT = width / height;

import RNPhotosFramework from 'react-native-photos-framework';
import ImageItem from './ImageItem';

class CameraRollPicker extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.allPhotos = [];

    this.state = {
      images: [],
      selected: this.props.selected,
      lastCursor: null,
      loadingMore: false,
      noMore: false,
      dataSource: this.ds.cloneWithRows([]),
    };
  }

  componentWillMount(){
    this._fetch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected,
    });

   this._appendImages(this.allPhotos);

    AsyncStorage.getItem('shouldReloadCameraRoll')
    .then(shouldReloadCameraRoll => {
      if(JSON.parse(shouldReloadCameraRoll)) {
        AsyncStorage.setItem('shouldReloadCameraRoll', JSON.stringify(false));
        this._fetch();
      }
    });
  }

  fetch() {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => { this._fetch(); });
    }
  }

  _fetch() {
    RNPhotosFramework.requestAuthorization().then((statusObj) => {
      if (statusObj.isAuthorized) {

        RNPhotosFramework.getAssets({
          startIndex: 0,
          endIndex: 3000,
          preCacheAssets: true,
          prepareForSizeDisplay: {width: WINDOW_WIDTH/3, height: WINDOW_WIDTH/3},
          trackInsertsAndDeletes: true,
          assetDisplayStartToEnd: true,
          fetchOptions : {
            sourceTypes: ['userLibrary'],
            sortDescriptors : [
              {
                key: 'creationDate',
                ascending: false,
              }
            ]
          }
        }).then((response) => {
          return this._appendImages(response.assets);
        });
      }
    });
  }

  _appendImages(assets) {
   this.allPhotos = assets;
    this.setState({
      dataSource: this.ds.cloneWithRows( this._nEveryRow(assets, this.props.imagesPerRow) )
    });
  }

  render() {
    var {dataSource} = this.state;
    var {
      scrollRenderAheadDistance,
      initialListSize,
      pageSize,
      removeClippedSubviews,
      imageMargin,
      backgroundColor,
      emptyText,
      emptyTextStyle,
    } = this.props;

    var listViewOrEmptyText = dataSource.getRowCount() > 0 ? (
      <ScrollView keyboardDismissMode='interactive' style={{ overflow: 'hidden' }} >
        <ListView
          style={{flex: 1, paddingTop: 50,  paddingBottom: 200 }}
          scrollRenderAheadDistance={scrollRenderAheadDistance}
          initialListSize={initialListSize}
          pageSize={pageSize}
          removeClippedSubviews={removeClippedSubviews}
          renderFooter={this._renderFooterSpinner.bind(this)}
          onEndReached={this._onEndReached.bind(this)}
          dataSource={dataSource}
          renderRow={rowData => this._renderRow(rowData)} />
        </ScrollView>
    ) : (
      <Text style={[{textAlign: 'center'}, emptyTextStyle]}>{emptyText}</Text>
    );

    return (
      <View
        style={[styles.wrapper, {padding: imageMargin, paddingRight: 0, backgroundColor: backgroundColor},]}>
        {listViewOrEmptyText}
      </View>
    );
  }

  _renderImage(item) {
    var {selected} = this.state;
    var {
      imageMargin,
      selectedMarker,
      imagesPerRow,
      containerWidth
    } = this.props;

    var uri = item.uri;
    var isSelected = (this._arrayObjectIndexOf(selected, 'uri', uri) >= 0) ? true : false;

    return (
      <ImageItem
        key={uri}
        item={item}
        selected={isSelected}
        imageMargin={imageMargin}
        selectedMarker={selectedMarker}
        imagesPerRow={imagesPerRow}
        containerWidth={containerWidth}
        onClick={this._selectImage.bind(this)}
      />
    );
  }

  _renderRow(rowData) {
    var items = rowData.map((item) => {
      if (item === null) {
        return null;
      }
      return this._renderImage(item);
    });

    return (
      <View style={styles.row}>
        {items}
      </View>
    );
  }

  _renderFooterSpinner() {
    if (!this.state.noMore) {
      return <ActivityIndicator style={styles.spinner} />;
    }
    return null;
  }

  _onEndReached() {
    if (!this.state.noMore) {
      this.fetch();
    }
  }

  _selectImage(image) {
    var {maximum, imagesPerRow, callback} = this.props;

    var selected = this.state.selected,
        index = this._arrayObjectIndexOf(selected, 'uri', image.uri);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      if (selected.length < maximum) {
        selected.push(image);
      }
    }

    this.setState({
      selected: selected,
      dataSource: this.ds.cloneWithRows(
        this._nEveryRow(this.state.images, imagesPerRow)
      ),
    });

    callback(this.state.selected, image);
  }

  _nEveryRow(data, n) {
    var result = [],
        temp = [];

    for (var i = 0; i < data.length; ++i) {
      if (i > 0 && i % n === 0) {
        result.push(temp);
        temp = [];
      }
      temp.push(data[i]);
    }

    if (temp.length > 0) {
      while (temp.length !== n) {
        temp.push(null);
      }
      result.push(temp);
    }

    return result;
  }

  _arrayObjectIndexOf(array, property, value) {
    return array.map((o) => { return o[property]; }).indexOf(value);
  }

}

const styles = StyleSheet.create({
  wrapper:{
    flex: 1,
  },
  row:{
    flexDirection: 'row',
    flex: 1,
  },
  marker: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'transparent',
  },
})

CameraRollPicker.propTypes = {
  scrollRenderAheadDistance: React.PropTypes.number,
  initialListSize: React.PropTypes.number,
  pageSize: React.PropTypes.number,
  removeClippedSubviews: React.PropTypes.bool,
  groupTypes: React.PropTypes.oneOf([
    'Album',
    'All',
    'Event',
    'Faces',
    'Library',
    'PhotoStream',
    'SavedPhotos',
  ]),
  maximum: React.PropTypes.number,
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),
  imagesPerRow: React.PropTypes.number,
  imageMargin: React.PropTypes.number,
  containerWidth: React.PropTypes.number,
  callback: React.PropTypes.func,
  selected: React.PropTypes.array,
  selectedMarker: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
  emptyText: React.PropTypes.string,
  emptyTextStyle: Text.propTypes.style,
}

CameraRollPicker.defaultProps = {
  scrollRenderAheadDistance: 500,
  initialListSize: 1,
  pageSize: 3,
  removeClippedSubviews: true,
  groupTypes: 'SavedPhotos',
  maximum: 15,
  imagesPerRow: 3,
  imageMargin: 5,
  assetType: 'Photos',
  backgroundColor: 'transparent',
  selected: [],
  callback: function(selectedImages, currentImage) {
    console.log(currentImage);
    console.log(selectedImages);
  },
  emptyText: 'No photos.',
}

export default CameraRollPicker;
