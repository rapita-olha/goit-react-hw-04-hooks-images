import { Component } from 'react';
import ImageGalleryItem from 'components/ImageGallery/ImageGalleryItem';
import s from 'components/ImageGallery/ImageGallery.module.css';

import PropTypes from 'prop-types';
export default class ImageGalleryList extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape).isRequired,
    showImages: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { trackScroll } = this.props;
    window.addEventListener('scroll', trackScroll);
  }

  componentWillUnmount() {
    const { trackScroll } = this.props;
    window.removeEventListener('scroll', trackScroll);
  }

  render() {
    const { images } = this.props;
    const { gallery } = s;
    return (
      <>
        <ul className={gallery} onClick={this.props.handleOpenModal}>
          {images &&
            images.map(image => (
              <ImageGalleryItem key={image.id} image={image} />
            ))}
        </ul>
      </>
    );
  }
}
