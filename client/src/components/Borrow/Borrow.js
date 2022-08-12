import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { returnBook } from '../../store/actions/bookActions';


const Borrow = ({ auth, user, returnBook}) => {

  // function to dispatch returnBook action
  const returnBookHandler = (e, bookId, uid) => {
    returnBook(bookId, uid);
  }


  useEffect(() => {
  }, [user.isLoading, user.error]);

  return (
    <div className={user.isLoading ? 'book loader' : 'book'}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{user.firstname + ' ' + user.lastname}</h5>
          <p className="card-text">{user.email}</p>
          
          <ul className="list-group list-group-flush">

            {user.populatedWithdrawals.map((withdrawal, index) => {
              return <li key={index} className="list-group-item">
                <div className="row">
                    <p>{withdrawal.book.title}</p>
                    <p>{moment(withdrawal.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>

                  {/* button to return book */}
                  <div className="col-md-12">
                    <button className="btn btn-primary" onClick={(e) => returnBookHandler(e, withdrawal.id, user.id)}>Return</button>
                  </div>
                </div>
              </li>;
            })}

            {user.populatedWithdrawals.length === 0 ? <li className="list-group-item">No books borrowed</li> : null}
          </ul>

        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { returnBook })(Borrow);
