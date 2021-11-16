import { Fragment } from 'react';
import { HiOutlineMailOpen } from 'react-icons/hi';

import { BsFillPersonFill } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { get } from 'lodash';
import { withUserAgent, withAgentDetails } from '../../recoil/ParkAgent';
import LoadScripts from '../../Hooks/loadScripts';
import './AgentProfile.css';

const AgentProfile = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const agentProfile = useRecoilValue(withUserAgent);
  const agentDetails = useRecoilValue(withAgentDetails);


  return (
    <Fragment>
      <div className="mt-5">
        <div className="row">
          <div className="col-sm-12 col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="card-media profile__media">
                  <div className="profile__avatar">
                    <img src="/images/male.svg" alt="avatar" className="card-img profile__img" />
                  </div>
                </div>

                <div className="card-copy mt-3">
                  <div className="d-flex justify-content-center mb-2">
                    <BsFillPersonFill className="text-primary mr-2" size={22} />
                    <span className="text-muted">{get(agentProfile, 'name', null)}</span>
                  </div>

                  <div className="d-flex justify-content-center">
                    <HiOutlineMailOpen className="text-primary mr-2" size={22} />
                    <span className="text-muted">{get(agentProfile, 'email', null)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-sm-12 col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12 col-md-12 mb-3">
                    <div className="panel bg-light shadow-sm p-2 rounded-sm">
                      <p className="m-0 text-uppercase font-w300 fs-6">Wallet Balance:</p>
                      <p className="m-0">{get(agentDetails, 'agent_wallet_amount', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="panel bg-light shadow-sm p-2 rounded-sm">
                      <p className="m-0 text-uppercase font-w300 fs-6">Name:</p>
                      <p className="m-0">{get(agentProfile, 'name', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="panel bg-light shadow-sm p-2 rounded-sm">
                      <p className="m-0 text-uppercase font-w300 fs-6">Email:</p>
                      <p className="m-0">{get(agentProfile, 'email', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="panel bg-light shadow-sm p-2 rounded-sm">
                      <p className="m-0 text-uppercase font-w300 fs-6">Staff Code:</p>
                      <p className="m-0">{get(agentDetails, 'agent_code', null)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AgentProfile;
