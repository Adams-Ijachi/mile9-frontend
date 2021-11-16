import { Fragment, Suspense } from 'react';
import { Schedules } from '../../components/Partials';
import { GridCards } from '../../components/Skeletons';
import LoadScripts from '../../Hooks/loadScripts';
import './AssignRideBuses.css';

const AssignRideBuses = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Manage Travel Schedules</h4>
      </div>
      
      <Suspense fallback={<GridCards cardHeight={400} cardRadius={20} cardEffect={`fade`} gridSize={`col-md-6`} />}>
        <Schedules />
      </Suspense>
    </Fragment>
  );
}

export default AssignRideBuses;
