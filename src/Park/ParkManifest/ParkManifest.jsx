import { Fragment } from 'react';
import { ManiFestList } from '../../components/Partials';
import LoadScripts from '../../Hooks/loadScripts';
import './ParkManifest.css';

const ParkManifest = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">Park Manifest</h4>
      </div>

      <ManiFestList />
    </Fragment>
  );
}

export default ParkManifest;
