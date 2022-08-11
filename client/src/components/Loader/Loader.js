import React from 'react';

import './styles.css';

const Loader = (props) => {
  return (
    <div className='d-flex justify-content-center' style={{maxWidth: '100%'}}>
    <div className="spinner-border mt-4" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    </div>
  );
};

export default Loader;
