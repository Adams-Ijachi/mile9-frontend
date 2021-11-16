import { Fragment, Suspense } from 'react';
// import { AddStaff } from '../../components/Partials';
import AddStaff from '../../components/Partials/AddStaff';
import Staff from '../../components/Partials/Staff';
import LoadScripts from '../../Hooks/loadScripts';
import { GridCards } from '../../components/Skeletons'
import './ParkStaff.css';

const ParkStaff = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Park Staff</h4>
        <AddStaff />
      </div>

      <Suspense fallback={<GridCards cardHeight={350} cardRadius={15} cardEffect={"fade"} />}>
        <Staff />
      </Suspense>
    </Fragment>
  );
}

export default ParkStaff;
