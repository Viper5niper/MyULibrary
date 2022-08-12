import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import moment from 'moment';

import { getUsers } from '../../store/actions/usersActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAdmin from '../../hoc/requireAdmin';
import { userSchema } from './validation';
import { registerUserWithEmail } from '../../store/actions/registerActions';

const Users = ({ getUsers, users: { users, isLoading }, register: { regIsLoading, error } , registerUserWithEmail}) => {
  useEffect(() => {
    getUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstname: 'asdads',
      lastname: 'asdasdas',
      username: 'mg17004',
      email: 'administrador@systemexample.net',
      password: 'asdasdasda',
      role: 'ADMIN',
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      registerUserWithEmail(values);
      getUsers();
      // console.log(values);
    },
  });

  return (
    <Layout>
      <div className="mt-4">
        <h1>Users page</h1>
        <p>
          This is the Users page. Here are listed all of the users of the app. Click the avatar or
          the username link to go to user's profile. Only librarian users can see this page.
        </p>
        <div className="row mb-4">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <form onSubmit={formik.handleSubmit} className="row">
                  <h5 className='card-title mb-3'>Register new user</h5>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      placeholder="Name"
                      name="firstname"
                      className="form-control"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstname}
                    />
                    {formik.touched.firstname && formik.errors.firstname ? (
                      <p className="text-danger">{formik.errors.firstname}</p>
                    ) : null}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Last Name:</label>
                    <input
                      placeholder="Name"
                      name="lastname"
                      className="form-control"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastname}
                    />
                    {formik.touched.lastname && formik.errors.lastname ? (
                      <p className="text-danger">{formik.errors.lastname}</p>
                    ) : null}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Username:</label>
                    <input
                      placeholder="Username"
                      name="username"
                      className="form-control"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <p className="text-danger">{formik.errors.username}</p>
                    ) : null}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      placeholder="Email address"
                      name="email"
                      className="form-control"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <p className="text-danger">{formik.errors.email}</p>
                    ) : null}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Password:</label>
                    <input
                      placeholder="Password"
                      name="password"
                      className="form-control"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <p className="text-danger">{formik.errors.password}</p>
                    ) : null}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Role:</label>
                    <select class="form-select" name="role" onChange={formik.handleChange} aria-label="Default select example">
                      <option value="STUDENT" selected={formik.values.role === "STUDENT" }>STUDENT</option>
                      <option value="ADMIN" selected={formik.values.role === "ADMIN" }>LIBRARIAN</option>
                    </select>
                    {formik.touched.email && formik.errors.email ? (
                      <p className="text-danger">{formik.errors.email}</p>
                    ) : null}
                  </div>

                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {users.map((user, index) => {
                return (
                  <div key={index} className="card mb-4">

                    <div className="row g-0">
                      <div className="col-md-4">
                        <Link to={`/${user.username}`}>
                          <img src={user.avatar} className="img-fluid rounded-start" />
                        </Link>
                      </div>

                      <div className="col-md-8">
                        <div className="card-body">

                          <div>
                            <span className="label">Role: </span>
                            <span className="info">{user.role == "ADMIN" ? "LIBRARIAN" : user.role}</span>
                          </div>
                          <div>
                            <span className="label">Name: </span>
                            <span className="info">{user.firstname + ' ' + user.lastname}</span>
                          </div>
                          <div>
                            <span className="label">Username: </span>
                            <Link to={`/${user.username}`} className="info bold profile-link">
                              {user.username}
                            </Link>
                          </div>
                          <div>
                            <span className="label">Email: </span>
                            <span className="info">{user.email}</span>
                          </div>
                          <div>
                            <span className="label">Joined: </span>
                            <span className="info">
                              {moment(user.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  register: state.register,
});

export default compose(requireAdmin, connect(mapStateToProps, { getUsers, registerUserWithEmail }))(Users);
