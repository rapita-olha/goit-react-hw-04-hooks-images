import { Component } from 'react';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import s from 'components/Modal/Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

class Modal extends Component {
  static propTypes = {
    imgIdx: PropTypes.number.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleGalleryNav: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleGalleryNav);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleGalleryNav);
  }

  handleGalleryNav = ({ code }) => {
    const { imgIdx, closeModal, handleGalleryNav } = this.props;

    switch (code) {
      case 'Escape':
        closeModal();
        break;

      case 'ArrowRight':
        handleGalleryNav(imgIdx + 1);
        break;

      case 'ArrowLeft':
        handleGalleryNav(imgIdx - 1);
        break;

      default:
        toast.info('Press ESC to exit');
    }
  };

  handleBackdropClick = ({ target, currentTarget }) => {
    const { closeModal } = this.props;
    if (target === currentTarget) {
      closeModal();
    }
  };

  render() {
    const { modal, overlay } = s;
    const { children } = this.props;

    return createPortal(
      <div className={overlay} onClick={this.handleBackdropClick}>
        <div className={modal}>{children}</div>
      </div>,
      modalRoot,
    );
  }
}

export default Modal;
