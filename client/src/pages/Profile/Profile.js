import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getProfile, editUser, deleteUser } from '../../store/actions/userActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { profileSchema } from './validation';


const Profile = ({
  getProfile,
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  deleteUser,
  loadMe,
  history,
  match,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const retryCount = useRef(0);
  const matchUsername = match.params.username;

  useEffect(() => {
    getProfile(matchUsername, history);
  }, [matchUsername]);

  // if changed his own username reload me, done in userActions

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    setAvatar(event.target.files[0]);
  };

  const handleClickEdit = () => {
    retryCount.current = 0;
    setIsEdit((oldIsEdit) => !oldIsEdit);
    setImage(null);
    setAvatar(null);
    formik.setFieldValue('id', profile.id);
    formik.setFieldValue('firstname', profile.firstname);
    formik.setFieldValue('lastname', profile.lastname);
    formik.setFieldValue('username', profile.username);
  };

  const handleDeleteUser = (id, history) => {
    deleteUser(id, history);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: '',
      firstname: '',
      lastname: '',
      username: '',
      password: '',
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('username', values.username);
      if (profile.provider === 'email') {
        formData.append('password', values.password);
      }
      editUser(values.id, formData, history);
      //setIsEdit(false);
    },
  });

  return (
    <Layout>
      <div className="mt-4">
        <h1>Profile page</h1>
        <p>
          This is the profile page. Any user can edit its own profile and Admin can edit any user's
          profile. Only authenticated users can see this page.
        </p>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="card mb-4">

            <div className="row g-0">
              <div className="col-md-4">
                <img src={image ? image : profile.avatar} className="img-fluid rounded-start" />
              </div>

              <div className="col-md-8">
                <div className="card-body">
                  <div>
                    <span className="label">Role: </span>
                    <span className="info">{profile.role == "ADMIN" ? "LIBRARIAN" : profile.role}</span>
                  </div>
                  <div>
                    <span className="label">Name: </span>
                    <span className="info">{profile.firstname + ' ' + profile.lastname}</span>
                  </div>
                  <div>
                    <span className="label">Username: </span>
                    <span className="info">{profile.username}</span>
                  </div>
                  <div>
                    <span className="label">Email: </span>
                    <span className="info">{profile.email}</span>
                  </div>
                  <div>
                    <span className="label">Joined: </span>
                    <span className="info">
                      {moment(profile.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                    </span>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleClickEdit}
                      disabled={!(me?.username === profile.username || me?.role === 'ADMIN')}
                    >
                      {isEdit ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-danger">{error}</p>}

        {isEdit && (
          <div className="card">
            <div className="card-body">
              <div className="row">
                <form onSubmit={formik.handleSubmit} className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Avatar:</label>
                    <input className="form-control" name="image" type="file" onChange={onChange} />
                    {image && (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setImage(null);
                          setAvatar(null);
                        }}
                        type="button"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input name="id" type="hidden" value={formik.values.id} />
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
                  {profile.provider === 'email' && (
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
                  )}
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button
                        onClick={() => handleDeleteUser(profile.id, history)}
                        type="button"
                        className="btn btn-danger"
                      >
                        Delete profile
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getProfile, editUser, deleteUser, loadMe }),
)(Profile);
