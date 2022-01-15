import { Component } from 'react';
import PropTypes from 'prop-types';

import s from 'components/ImageGallery/ImageGalleryItem/ImageGalleryItem.module.css';

class ImageGalleryItem extends Component {
  static propTypes = {
    image: PropTypes.shape({
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    }).isRequired,
  };
  render() {
    const { webformatURL, tags } = this.props.image;
    const { image, item } = s;
    return (
      <li className={item}>
        <img src={webformatURL} alt={tags} className={image} />
      </li>
    );
  }
}

export default ImageGalleryItem;
