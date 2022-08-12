import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/actions/authActions';
import { loginSchema } from './validation';


const Login = ({ auth, history, loginUserWithEmail }) => {
  const formik = useFormik({
    initialValues: {
      email: 'email0@email.com',
      password: '123456789',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginUserWithEmail(values, history);
    },
  });

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="card m-4 mx-auto" style={{maxWidth: '50%'}}>
      <div className="card-body mx-2">
        <h2 className='card-title ml-4'>Log in</h2>
        <h6 class="card-subtitle mb-4 text-muted">
          back to{' '}
          <Link className="bold" to="/">
            Home page
          </Link>
        </h6>
        <form onSubmit={formik.handleSubmit} className="row">
          <div className="col-md-6">
            <h4>Login with email address</h4>
            <p className="logins">Admin: email0@email.com 123456789</p>
            <p className="logins">User: email1@email.com 123456789</p>
          </div>
          <div className='col-md-6'>
            <input
              placeholder="Email address"
              name="email"
              className="form-control mb-2"
              type="text"
              aria-describedby="invalidemailFeedback"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-danger" id="invalidemailFeedback">{formik.errors.email}</p>
            ) : null}
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="form-control mb-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-danger">{formik.errors.password}</p>
            ) : null}

            <button
              className="btn btn-primary form-control mb-4"
              disabled={auth.isLoading || !formik.isValid}
              type="submit"
            >
              Log in now
            </button>
          </div>
          {auth.error && <p className="invalid-feedback">{auth.error}</p>}
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
