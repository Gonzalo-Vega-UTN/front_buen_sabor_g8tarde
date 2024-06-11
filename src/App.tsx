// App.tsx

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import { useAuth } from './Auth/Auth';
import Layout from './components/Layout/Layout';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Layout>
        <div className="container-fluid p-0">
          <div className="row">
            {isAuthenticated && (
              <div className="col-md-2">
                <Sidebar />
              </div>
            )}
            <div className="col-md-10 d-flex flex-column justify-content-between p-0 m-0">
              <div className="row">
                <div className="col-md-12">
                  <AppRoutes />
                </div>
              </div>
              <div className="row justify-content-between align-items-end">
                <div className="col-md-12 m-0 p-0">
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
