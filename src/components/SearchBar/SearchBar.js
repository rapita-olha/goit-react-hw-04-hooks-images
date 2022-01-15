import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import s from 'components/SearchBar/SearchBar.module.css';

class SearchBar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  state = {
    query: '',
  };

  handleChange = ({ currentTarget: { value } }) =>
    this.setState({ query: value });

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.query.trim() === '') {
      toast.info('please type a query');
      return;
    }

    const normalizedQuery = this.state.query.trim().toLowerCase();
    this.props.onSubmit(normalizedQuery);
    this.setState({ query: '' });
    e.currentTarget.reset();
  };

  render() {
    const { searchBar, searchForm, button, label, input } = s;
    return (
      <header className={searchBar}>
        <form className={searchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={button} onSubmit={this.handleSubmit}>
            <span className={label}>Search</span>
          </button>

          <input
            className={input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

export default SearchBar;
