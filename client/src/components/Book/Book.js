import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { deleteBook, withdrawBook, editBook, clearBookError } from '../../store/actions/bookActions';


const Book = ({ book, auth, deleteBook, withdrawBook, editBook, clearBookError }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (!isEdit) {
      deleteBook(id);
    }
  };

  const HandleBorrow = (e, id, quantity) => {
    e.preventDefault();
    if (isEdit) {
      withdrawBook(id, quantity);
      // setIsEdit((oldIsEdit) => !oldIsEdit);
    }
  };

  const handleClickEdit = (e) => {
    e.preventDefault();
    setIsEdit((oldIsEdit) => !oldIsEdit);
  };

  // dont reset form if there is an error
  useEffect(() => {

  }, [book.error, book.isLoading]);

  // keep edit open if there is an error
  useEffect(() => {
    if (book.error) setIsEdit(true);
  }, [book.error]);

  return (
    <div className={book.isLoading ? 'book loader' : 'book'}>
      <div className="card">
        <div className='card-body'>
          <h5 className="card-title">{book.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted"> By {book.author} ({book.year})</h6>

          <p className="">Genre: {book.genre}</p>
          {!moment(book.createdAt).isSame(book.updatedAt, 'minute') && (
            <span className="">{`Edited: ${moment(
              book.updatedAt,
            ).fromNow()}`}</span>
          )}
            {isEdit ? (
              <p className="">Copies avialable: {book.stock}</p>
            ) : (
              auth.isAuthenticated ? <p>See details for existencies</p> : <p>Login to see details</p>
            )}
            {auth.isAuthenticated && (
              <>
                {!isEdit ? (
                  <>
                    <button onClick={handleClickEdit} type="button" className="btn btn-primary">
                      Details
                    </button>{' '}
                    
                    {auth.me?.role === 'ADMIN' && 
                    <button onClick={(e) => handleDelete(e, book.id)} type="button" className="btn btn-primary">
                      Delete
                    </button>}
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={(e) => HandleBorrow(e, book.id, 1)} disabled={book.isLoading}>
                      Borrow
                    </button>{' '} 
                    <button
                      onClick={() => {
                        setIsEdit((oldIsEdit) => !oldIsEdit);
                        clearBookError(book.id);
                      }}
                      type="button"
                      className="btn btn-primary"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}
          
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteBook, editBook, withdrawBook, clearBookError })(Book);
