import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Book from '../Book/Book';
import Loader from '../Loader/Loader';

import { getBooks, searchBooks } from '../../store/actions/bookActions';

const BookList = ({ getBooks, searchBooks, book: { books, isLoading, error } }) => {

  useEffect(() => {
    getBooks();
  }, []);

  const search = (e) => {
    searchBooks(e.target.value);
  }

  return (
    <div>
      <div className='row'>
      <h2 className='col-lg-8 '>Books:</h2>
      <div className="col-lg-4 mb-3">
          <label for="author" class="form-label">Search</label>
          <input
              className="form-control mb-2"
              type="text"
              onChange={search}
              defaultValue=""
            />
        </div>
      </div>
      {error && <div className="error-center">{error}</div>}
      <div className="row">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="row">
            {books.map((book, index) => {
              return <div key={index} className='col-md-4 mb-2'><Book key={index} book={book} /></div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  book: state.book,
});

export default connect(mapStateToProps, { getBooks, searchBooks })(BookList);
