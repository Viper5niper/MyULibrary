import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {  } from '../../store/actions/bookActions';


const Borrow = ({ auth, user }) => {
  // dont reset form if there is an error
  useEffect(() => {

  }, []);

  return (
    <div className={user.isLoading ? 'book loader' : 'book'}>
      <div className="card">
        {JSON.stringify(user)}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Borrow);
