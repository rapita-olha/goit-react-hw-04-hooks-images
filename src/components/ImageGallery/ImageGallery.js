import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import ImageSearchApi from 'services/image-search-api';
import ErrorView from 'components/ImageGallery/ErrorView';
import IdleView from 'components/ImageGallery/IdleView';
import ImageGalleryList from 'components/ImageGallery/ImageGalleryList/ImageGalleryList';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ButtonUp from 'components/ButtonUp/ButtonUp';

const KEY = '23099958-a9e73d010620c28e46bfb8a54';
const BASE_URL = 'https://pixabay.com/api/?';
const imageSearchApi = new ImageSearchApi(KEY, BASE_URL);

export default function ImageGallery({ query }) {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showGoUpBtn, setShowGoUpBtn] = useState(false);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (query.trim() === '') {
      return;
    }
    setImages([]);
    imageSearchApi.searchQuery = query;
    imageSearchApi.resetPage();
    showImages();
  }, [query]);

  useEffect(() => {
    if (images.length < 12) {
      setShowLoadMoreBtn(false);
    } else {
      setShowLoadMoreBtn(true);
    }
    if (images.length > 12) {
      scrollDown();
    }
  }, [images.length, showLoadMoreBtn]);

  async function showImages() {
    setShowLoader(true);
    try {
      const fetchedImages = await imageSearchApi.fetchData();

      if (fetchedImages.length === 0) {
        toast.warning("Sorry, we couldn't find anything");
        setStatus('idle');
        return;
      }

      setImages(prevImages => [...prevImages, ...fetchedImages]);
      setStatus('resolved');
      setShowLoader(false);
      imageSearchApi.incrementPage();
    } catch {
      setStatus('rejected');
      toast.error('Something went wrong...(');
    }
  }

  function scrollDown() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  function trackScroll() {
    let scrolled = window.pageYOffset;
    let coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      setShowGoUpBtn(true);
    }
    if (scrolled < coords) {
      setShowGoUpBtn(false);
    }
  }

  function goBackToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(goBackToTop, 0);
    }
  }

  function toggleModal() {
    setShowModal(modal => !modal);
  }

  function onOpenModal({ target }) {
    if (target.nodeName !== 'IMG') {
      return;
    }
    const activeIdx = findActiveIdx(target.src);
    setActiveIdx(activeIdx);
    toggleModal();
  }

  function findActiveIdx(source) {
    let activeIdx;
    images.forEach(({ webformatURL }, idx) => {
      if (webformatURL === source) {
        activeIdx = idx;
      }
    });
    return activeIdx;
  }

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
          showImages={showImages}
          handleOpenModal={onOpenModal}
          trackScroll={trackScroll}
        />
        {showLoader && (
          <Loader
            type="Oval"
            color="#da5f01"
            height={80}
            width={80}
            style={{ margin: '0 auto' }}
          />
        )}
        {showLoadMoreBtn && <Button onClick={showImages} />}

        {<ButtonUp onClick={goBackToTop} isVisible={showGoUpBtn} />}
        {showModal && (
          <Modal
            closeModal={toggleModal}
            handleGalleryNav={setActiveIdx}
            imgIdx={activeIdx}
            images={images}
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

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};
