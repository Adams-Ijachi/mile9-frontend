import { Fragment, Suspense } from 'react'
import LoadScripts from '../../Hooks/loadScripts';
import { AddBus, Buses } from '../../components/Partials';
import { GridCards } from '../../components/Skeletons';
import './ParkBuses.css';

const ParkBuses = () => {

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
      <h4 className="text-uppercase fs-5 overline m-0">Park Buses</h4>
      <AddBus />
    </div>
    
    <Suspense fallback={<GridCards cardHeight={180} cardRadius={15} cardEffect={"fade"} />}>
      <Buses />
    </Suspense>
    </Fragment>
  )
}

export default ParkBuses;
