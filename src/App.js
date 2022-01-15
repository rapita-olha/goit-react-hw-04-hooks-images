import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SearchBar from 'components/SearchBar';
import ImageGallery from 'components/ImageGallery';
import s from './App.module.css';

class App extends Component {
  state = {
    query: '',
  };

  setQuery = query => {
    this.setState({ query });
  };

  render() {
    const { grid } = s;
    return (
      <div className={grid}>
        <SearchBar onSubmit={this.setQuery} />
        <ImageGallery query={this.state.query} />
        <ToastContainer autoClose={3000} theme="dark" />
      </div>
    );
  }
}

export default App;
