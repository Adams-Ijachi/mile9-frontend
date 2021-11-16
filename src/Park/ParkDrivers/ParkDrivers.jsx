import { Fragment, Suspense } from 'react';
import AddDriver from '../../components/Partials/AddDriver';
import Drivers from '../../components/Partials/Drivers';
import { GridCards } from '../../components/Skeletons';
import LoadScripts from '../../Hooks/loadScripts';
import './ParkDriver.css';

const ParkDrivers = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Park Drivers</h4>
        <AddDriver />
      </div>

      <Suspense fallback={<GridCards cardHeight={180} cardRadius={15} cardEffect={"fade"} />}>
        <Drivers />
      </Suspense>
    </Fragment>
  )
}

export default ParkDrivers;
