import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import _ from 'lodash';
import { withUserAgent } from '../../recoil/ParkAgent';
import LoadScripts from '../../Hooks/loadScripts';
import AgentBookUser from '../AgentBookUser/AgentBookUser';
import './AgentDashboard.css';

const AgentDashboard = () => {

  const agentDetails = useRecoilValue(withUserAgent);

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
        <h4 className="saluation salutation__overline m-0">Hey {_.split(_.get(agentDetails, 'name', null), ' ', 1)}, Welcome Back!</h4>
        <AgentBookUser />
      </div>
    </Fragment>
  );
}

export default AgentDashboard;
