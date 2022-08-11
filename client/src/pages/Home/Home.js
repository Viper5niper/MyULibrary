import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';
import BookList from '../../components/BookList/BookList';
import BookForm from '../../components/BookForm/BookForm';
import { reseedDatabase } from '../../store/actions/authActions';

// import './styles.css';

const ReseedMessage = ({ handleReseed }) => {
  return (
    <div className='row mb-4'>
      <span className='col-md-8'>
        If the app has been vandalized just reseed the database by clicking reseed button
      </span>
      <div className='col-md-4'>
        <button onClick={handleReseed} className="btn btn-info">
          Reseed Database
        </button>
      </div>
    </div>
  );
};

const Home = ({ auth, reseedDatabase }) => {
  const handleReseed = () => {
    reseedDatabase();
  };

  return (
    <Layout>
      <div className="row mt-4">
        <h1>Home page</h1>
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{' '}
              <Link className="bold" to="/login">
                Log in
              </Link>{' '}
              and start reading today!
            </p>
            <ReseedMessage handleReseed={handleReseed} />
          </div>
        ) : (
          <>
            <p>
              Welcome <span className="name">{auth.me.name}</span>!
            </p>
            <ReseedMessage handleReseed={handleReseed} />
            {auth.me.role === 'ADMIN' && <BookForm />}
          </>
        )}
        <BookList />
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { reseedDatabase }))(Home);
