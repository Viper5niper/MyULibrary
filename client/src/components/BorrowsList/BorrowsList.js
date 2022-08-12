import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Borrow from '../Borrow/Borrow';
import Loader from '../Loader/Loader';

import { getWithdrawals } from '../../store/actions/bookActions';

const BorrowsList = ({ getWithdrawals, users: { users, isLoading, error } }) => {

  useEffect(() => {
    getWithdrawals();
  }, []);

  return (
    <div>
      <div className='row'>
        <h2 className='col-lg-8 '>Users that had borrowed books:</h2>
        {error && <div className="error-center">{error}</div>}
        <div className="row">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="row">
              {users.map((user, index) => {
                return <div key={index} className='col-md-4 mb-2'><Borrow key={index} user={user} /></div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { getWithdrawals })(BorrowsList);
