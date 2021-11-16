import { Fragment, Suspense } from 'react';
import { SkeletonBlock } from 'skeleton-elements/react';
import { useHistory } from 'react-router';
import LoadScripts from '../../Hooks/loadScripts';
import ParkTransaction from '../ParkTransactions/ParkTransaction';
import { TableLoader, GridCards } from '../../components/Skeletons';
import { RevenueChart } from '../../components/Partials';
import { useRecoilState } from 'recoil';
import { parkAdminAtom } from '../../recoil/parkAdmin';
import { SalesCount } from '../../components/Partials';
import "skeleton-elements/skeleton-elements.css";

const ParkAdminDashboard = () => {
  const history = useHistory();
  const [parkAdmin] = useRecoilState(parkAdminAtom);
  console.log('Admin', parkAdmin);

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");


  return (
    <Fragment>
      <div className="d-app-flex m-0 mb-3">
        <h4 className="saluation salutation__overline m-0">Hey {_.get(parkAdmin, 'first_name', null)}, Welcome Back!</h4>
      </div>

      <div className="row">
        <div className="col-sm-12 col-md-4">
          <Suspense fallback={
            <SkeletonBlock 
              className="bg-app-light" 
              tag="div" 
              height={280} 
              borderRadius={20} 
              effect={`fade`} 
            />
          }>
            <SalesCount />
          </Suspense>
        </div>

        <div className="col-sm-12 col-md-8">
          {/* Component Goes Here*/}
          <Suspense fallback={
            <SkeletonBlock 
              className="bg-app-light" 
              tag="div" 
              height={280} 
              borderRadius={20} 
              effect={`fade`} 
            />
          }>
            <RevenueChart />
          </Suspense>
          {/* Component Goes Here */}
        </div>
      </div>

      {/* Table */}
      <h4 className="saluation salutation__overline m-0">TRANSACTION HISTORY</h4>
      <Suspense fallback={<TableLoader />}>
        <ParkTransaction />
      </Suspense>
      
    </Fragment>
  )
}

export default ParkAdminDashboard
