import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useFormik } from 'formik';

import { deleteBook, editBook, clearBookError } from '../../store/actions/bookActions';
import { bookFormSchema } from './validation';


const Book = ({ book, auth, deleteBook, editBook, clearBookError }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (!isEdit) {
      deleteBook(id);
    }
  };

  const handleClickEdit = (e) => {
    e.preventDefault();
    formik.setFieldValue('text', book.text);
    setIsEdit((oldIsEdit) => !oldIsEdit);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      text: '',
      id: book.id,
    },
    validationSchema: bookFormSchema,
    onSubmit: (values, { resetForm }) => {
      editBook(values.id, { text: values.text });
      setIsEdit(false);
      // resetForm();
    },
  });

  // dont reset form if there is an error
  useEffect(() => {
    if (!book.error && !book.isLoading) formik.resetForm();
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
          <h6 class="card-subtitle mb-2 text-muted"> By {book.author} ({book.year})</h6>

          <p className="">Genre: {book.genre}</p>
          <p className="">Copies avialable: {book.stock}</p>
          <span className="">{" Added " + moment(book.createdAt).fromNow()}</span>
          {!moment(book.createdAt).isSame(book.updatedAt, 'minute') && (
            <span className="">{`Edited: ${moment(
              book.updatedAt,
            ).fromNow()}`}</span>
          )}
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        {isEdit ? (
          <>
            <textarea
              name="text"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.text}
              disabled={book.isLoading}
            />
            <input type="hidden" name="id" />
            {(formik.touched.text && formik.errors.text) || book.error ? (
              <p className="error">{formik.errors.text || book.error}</p>
            ) : null}
          </>
        ) : (
          <p>{book.text}</p>
        )}
        {auth.isAuthenticated && auth.me.role === 'ADMIN' && (
          <>
            {!isEdit ? (
              <>
                <button onClick={handleClickEdit} type="button" className="btn">
                  Edit
                </button>
                <button onClick={(e) => handleDelete(e, book.id)} type="button" className="btn">
                  Delete
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="btn" disabled={book.isLoading}>
                  Submit
                </button>
                <button
                  onClick={() => {
                    setIsEdit((oldIsEdit) => !oldIsEdit);
                    clearBookError(book.id);
                  }}
                  type="button"
                  className="btn"
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteBook, editBook, clearBookError })(Book);
