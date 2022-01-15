import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import ImageSearchApi from 'services/image-search-api';
import Loader from 'components/ImageGallery/Loader';
import ErrorView from 'components/ImageGallery/ErrorView';
import IdleView from 'components/ImageGallery/IdleView';
import ImageGalleryList from 'components/ImageGallery/ImageGalleryList/ImageGalleryList';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ButtonUp from 'components/ButtonUp/ButtonUp';

const KEY = '23099958-a9e73d010620c28e46bfb8a54';
const BASE_URL = 'https://pixabay.com/api/?';
const imageSearchApi = new ImageSearchApi(KEY, BASE_URL);

class ImageGallery extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    error: null,
    showModal: false,
    showGoUpBtn: false,
    showLoadMoreBtn: false,
    showLoader: false,
    activeIdx: null,
    status: 'idle',
  };

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.props;
    const { images } = this.state;
    if (prevProps.query !== query) {
      this.resetSearchParams();
      this.showImages();
    }

    if (prevState.images !== images && images && images.length >= 12) {
      this.setState({ showLoadMoreBtn: true });
    }
    if (prevState.images !== images && images && images.length < 12) {
      this.setState({ showLoadMoreBtn: false });
    }
  }

  resetSearchParams = () => {
    const { query } = this.props;
    imageSearchApi.searchQuery = query;
    imageSearchApi.resetPage();
    this.setState({ images: [] });
  };

  showImages = async () => {
    this.setState({ showLoader: true });

    try {
      const fetchedImages = await imageSearchApi.fetchData();

      if (fetchedImages.length === 0) {
        toast.warning("Sorry, we couldn't find anything");
        this.setState({ status: 'idle' });
        return;
      }

      this.setState(({ images }) => {
        return {
          images: [...images, ...fetchedImages],
          status: 'resolved',
          showLoader: false,
        };
      });

      imageSearchApi.incrementPage();

      if (this.state.images.length > 12) {
        this.scrollDown();
      }
    } catch (error) {
      this.setState({ error, status: 'rejected' });
      toast.error('Something went wrong...(');
    }
  };

  scrollDown = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  trackScroll = () => {
    let scrolled = window.pageYOffset;
    let coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      this.setState({ showGoUpBtn: true });
    }
    if (scrolled < coords) {
      this.setState({ showGoUpBtn: false });
    }
  };

  goBackToTop = () => {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(this.goBackToTop, 0);
    }
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  handleOpenModal = ({ target }) => {
    if (target.nodeName !== 'IMG') {
      return;
    }
    this.findActiveIdx(target.src);
    this.toggleModal();
  };

  findActiveIdx = source => {
    const { images } = this.state;
    images.forEach(({ webformatURL }, idx) => {
      if (webformatURL === source) {
        this.setState({ activeIdx: idx });
      }
    });
  };

  showNextImage = nextIdx => {
    const { images } = this.state;
    if (nextIdx === images.length) {
      this.setState({ activeIdx: 0 });
    } else if (nextIdx === -1) {
      this.setState({ activeIdx: images.length - 1 });
    } else {
      this.setState({ activeIdx: nextIdx });
    }
  };

  render() {
    const {
      status,
      images,
      showModal,
      activeIdx,
      showGoUpBtn,
      showLoadMoreBtn,
      showLoader,
    } = this.state;

    if (status === 'idle') {
      return <IdleView />;
    }

    if (status === 'rejected') {
      return <ErrorView />;
    }

    if (status === 'resolved') {
      return (
        <>
          <ImageGalleryList
            images={images}
            showImages={this.showImages}
            handleOpenModal={this.handleOpenModal}
            trackScroll={this.trackScroll}
          />
          {showLoader && <Loader />}
          {showLoadMoreBtn && <Button onClick={this.showImages} />}

          {<ButtonUp onClick={this.goBackToTop} isVisible={showGoUpBtn} />}
          {showModal && (
            <Modal
              imgIdx={activeIdx}
              closeModal={this.toggleModal}
              handleGalleryNav={this.showNextImage}
            >
              <img
                src={images[activeIdx].largeImageURL}
                alt={images[activeIdx].tags}
                width={1000}
              />
            </Modal>
          )}
        </>
      );
    }
  }
}

export default ImageGallery;
