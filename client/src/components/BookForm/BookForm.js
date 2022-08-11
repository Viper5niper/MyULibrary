import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addBook } from '../../store/actions/bookActions';
import { bookFormSchema } from './validation';

const BookForm = ({ addBook, book: { books } }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      year: '',
      genre: '',
      stock: '',
    },
    validationSchema: bookFormSchema,
    onSubmit: (values, { resetForm }) => {
      addBook({ title: values.title, 
                author: values.author,
                year: values.year,
                genre: values.genre,
                stock: values.stock });
      resetForm();
    },
  });

  const isSubmiting = books.some((m) => m.id === 0);

  return (
    <div className="card mb-4">
      <form onSubmit={formik.handleSubmit} className="row card-body">
      <h4 className='card-title'>Add a book</h4>
        <div className="col-lg-8 mb-3">
          <label for="title" className="form-label">Book Title</label>
          <textarea
            name="title"
            cols="30"
            rows="1"
            className='form-control'
            placeholder="Awesome title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            disabled={isSubmiting}
          />
          {formik.touched.title && formik.errors.title ? (
          <p className="text-danger">{formik.errors.title}</p>
        ) : null}
        </div>
        
        <div className="col-lg-4 mb-3">
          <label for="author" className="form-label">Initial Stock</label>
          <input
              placeholder="1"
              name="stock"
              className="form-control mb-2"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stock}
            />
            {formik.touched.stock && formik.errors.stock ? (
              <p className="text-danger">{formik.errors.stock}</p>
            ) : null}
        </div>

        <div className="col-lg-4 mb-3">
          <label for="author" className="form-label">Author</label>
          <input
              placeholder="Jane Doe"
              name="author"
              className="form-control mb-2"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.author}
            />
            {formik.touched.author && formik.errors.author ? (
              <p className="text-danger">{formik.errors.author}</p>
            ) : null}
        </div>

        <div className="col-lg-4 mb-3">
          <label for="author" className="form-label">Year</label>
          <input
              placeholder="2020"
              name="year"
              className="form-control mb-2"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.year}
            />
            {formik.touched.year && formik.errors.year ? (
              <p className="text-danger">{formik.errors.year}</p>
            ) : null}
        </div>

        <div className="col-lg-4 mb-3">
          <label for="author" className="form-label">Genre</label>
          <input
              placeholder="Comedy"
              name="genre"
              className="form-control mb-2"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.genre}
            />
            {formik.touched.genre && formik.errors.genre ? (
              <p className="text-danger">{formik.errors.genre}</p>
            ) : null}
        </div>

        <div className="col-lg-12 mb-3">
          <input type="submit" className="btn btn-primary" value="Add Book" disabled={isSubmiting} />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  book: state.book,
});

export default connect(mapStateToProps, { addBook })(BookForm);
