import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import React from 'react';
import Loader from 'react-loader-spinner';

export default class App extends React.Component {
  render() {
    return (
      <Loader
        type="Oval"
        color="#da5f01"
        height={80}
        width={80}
        style={{ margin: '0 auto' }}
      />
    );
  }
}
