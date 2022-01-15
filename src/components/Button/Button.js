import { Component } from 'react';
import PropTypes from 'prop-types';

import s from 'components/Button/Button.module.css';

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { onClick } = this.props;
    const { button } = s;
    return (
      <button type="button" className={button} onClick={onClick}>
        <span>Show more</span>
      </button>
    );
  }
}
