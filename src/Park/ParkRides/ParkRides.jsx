import { Fragment, Suspense } from 'react';
import AddRide from '../../components/Partials/AddRide/AddRide';
import Rides from '../../components/Partials/Rides/Rides';
import { GridCards } from '../../components/Skeletons';
import LoadScripts from '../../Hooks/loadScripts';
import './ParkRides.css';

const ParkRides = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Park Travel Schedule</h4>
        <AddRide />
      </div>

      <Suspense fallback={<GridCards cardHeight={200} cardRadius={15} cardEffect={"fade"} />}>
        <Rides />
      </Suspense>
    </Fragment>
  );
}

export default ParkRides;
