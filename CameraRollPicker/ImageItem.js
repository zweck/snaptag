import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { BlurView } from 'react-native-blur';

class ImageItem extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
    var {width} = Dimensions.get('window');
    var {imageMargin, imagesPerRow, containerWidth} = this.props;

    if(typeof containerWidth != "undefined") {
      width = containerWidth;
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
  }

  render() {
    var {item, selected, selectedMarker, imageMargin} = this.props;
    let imageSize = selected ? this._imageSize-16 : this._imageSize;

    return (
      <TouchableOpacity
        style={{
          position: 'relative', 
          marginBottom: imageMargin, 
          marginRight: imageMargin,
          borderColor: '#3FD774',
          borderWidth: selected ? 8 : 0,
          borderRadius: selected ? this._imageSize/2 : 0,
          overflow: selected ? 'hidden' : 'visible',
        }}
        onPress={() => this._handleClick(item)}>
        <Image
          source={{uri: item.uri}}
          style={{height: imageSize, width: imageSize}} >
        </Image>
      </TouchableOpacity>
    );
  }

  _handleClick(item) {
    this.props.onClick(item);
  }
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
  },
})

ImageItem.defaultProps = {
  item: {},
  selected: false,
}

ImageItem.propTypes = {
  item: React.PropTypes.object,
  selected: React.PropTypes.bool,
  selectedMarker: React.PropTypes.element,
  imageMargin: React.PropTypes.number,
  imagesPerRow: React.PropTypes.number,
  onClick: React.PropTypes.func,
}

export default ImageItem;
