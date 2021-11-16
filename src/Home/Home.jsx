import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MiniFooter from '../components/core/MiniFooter';
import LoadScripts from '../Hooks/loadScripts';
import './Home.css';

const Home = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");
  
  return (
    <Fragment>
      <h2 className="text-center mt-5 mb-5">Welcome to Mile9ine App</h2>
      <div className="container mb-5">
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-sm-12">
            <div className="card overflow-hidden">
              <div className="text-center p-4 bg-success"></div>
              <div className="card-body">
                <div className="text-center">
                  <h3 className="mt-3 mb-1">Mile9ine User</h3>
                  <p className="text-muted">Book and Schedule Rides easily without being hassled</p>
                  <p className="mb-5"></p>
                  <Link to="/" className="btn btn-outline-primary btn-rounded mt-4 px-5">Book Now</Link>
                </div>
              </div>
              <div className="card-footer pt-0 pb-0 text-center">
                <div className="row">
                  <div className="col-12 pt-3 pb-3">
                    <h3 className="mb-1">1500</h3><span>Active Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-6 col-sm-12">
            <div className="card overflow-hidden">
              <div className="text-center p-4 overlay-box">
              </div>

              <div className="card-body">
                <div className="text-center">
                  <h3 className="mt-3 mb-1">Mile9ine Park Adimistrator</h3>
                  <p className="text-muted">Manage day to day park activities with clicks and realtime statics.</p>
                  <Link to="/park/admin/dashboard" className="btn btn-outline-primary btn-rounded mt-3 px-5">Manage Now</Link>
                </div>
              </div>
              <div className="card-footer pt-0 pb-0 text-center">
                <div className="row">
                  <div className="col-12 pt-3 pb-3">
                    <h3 className="mb-1">100</h3><span>Active Parks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-6 col-sm-12">
            <div className="card overflow-hidden">
              <div className="text-center p-4 bg-info-light">
              </div>

              <div className="card-body">
                <div className="text-center">
                  <h3 className="mt-3 mb-1">Mile9ine Park Agent</h3>
                  <p className="text-muted">Easily verify already booked passengers and also help to book new passengers.</p>
                  <Link to="/park/staff/dashboard" className="btn btn-outline-primary btn-rounded mt-3 px-5">SignIn</Link>
                </div>
              </div>
              <div className="card-footer pt-0 pb-0 text-center">
                <div className="row">
                  <div className="col-12 pt-3 pb-3">
                    <h3 className="mb-1">300</h3><span>Active Agents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MiniFooter className="auth-footer" />
    </Fragment>
  );
}

export default Home;
