import React from 'react';
import { Link } from 'react-router-dom';

import requireAdmin from '../../hoc/requireAdmin';
import Layout from '../../layout/Layout';
import BorrowsList from '../../components/BorrowsList/BorrowsList';

const Admin = () => {
  return (
    <Layout>
      <div className="row mt-4">
        <h1>Home page</h1>
        <p>
          Welcome! Here you can checkout the list of all the books that are currently borrowed.
        </p>
        <BorrowsList />
      </div>
    </Layout>
  );
};

export default requireAdmin(Admin);
