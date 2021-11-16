import { Link } from 'react-router-dom';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BiBus } from 'react-icons/bi';
import { GiSteeringWheel, GiCarSeat, GiMoneyStack } from 'react-icons/gi';
import { FaCaravan, FaWpforms } from 'react-icons/fa';
import { BsPersonSquare, BsFillInboxesFill } from 'react-icons/bs';
import { IoIosLogOut } from 'react-icons/io';
import { useRecoilValue } from 'recoil';
import { withParkSlug } from '../../../recoil/parkAdmin';
import FundParkWallet from '../../Partials/FundParkWallet/FundParkWallet';
import './SideBar.css';

const SideBar = () => {
  const parkNameSlug = useRecoilValue(withParkSlug);

  return (
    <>
      <div className="deznav">
        <div className="deznav-scroll">
          <span className="add-menu-sidebar" data-toggle="modal" data-target="#addOrderModalside">
          <GiMoneyStack size={23} className="mr-2" />
          Fund Account
          </span>
          {/*<div className="d-flex justify-content-center px-4 mt-3">
            <FundParkWallet classes={`add-menu-sidebar add__btn text-center flutterwave__btn`} />
        </div>*/}
          
          <ul className="metismenu" id="menu">
            <li>
              <Link to="/park/admin/dashboard" className="ai-icon has-flex">
                <i>
                  <AiOutlineDashboard size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            
            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <BiBus size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Buses</span>
              </a>
              
              <ul>
                <li><Link to={`/park/${parkNameSlug}/buses`}>Buses</Link></li>
                <li><Link to={`/park/${parkNameSlug}/manage/buses`}>Manage Buses</Link></li>
              </ul>
            </li>

            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <GiSteeringWheel size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Drivers</span>
              </a>

              <ul>
                <li>
                  <Link to={`/park/${parkNameSlug}/drivers`}>Drivers</Link>
                </li>
                <li>
                  <Link to={`/park/${parkNameSlug}/manage/drivers`}>Manage Drivers</Link>
                </li>
              </ul>
            </li>

            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <FaCaravan size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Travel Schedule</span>
              </a>

              <ul>
                <li>
                  <Link to={`/park/${parkNameSlug}/schedules`}>Schedules</Link>
                </li>
                <li>
                  <Link to={`/park/${parkNameSlug}/manage/schedules`}>Manage Schedules</Link>
                </li>
              </ul>
            </li>

            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <BsPersonSquare size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Staff</span>
              </a>

              <ul>
                <li>
                  <Link to={`/park/${parkNameSlug}/staff`}>Fund Staff</Link>
                </li>

                <li>
                  <Link to={`/park/${parkNameSlug}/manage/staff`}>Manage Staff</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to={`/park/${parkNameSlug}/assign-schedules`} className="ai-icon has-flex">
                <i>
                  <GiCarSeat size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Schedule Rides</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/${parkNameSlug}/inbox`} className="ai-icon has-flex">
                <i>
                  <BsFillInboxesFill size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Inbox</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/${parkNameSlug}/manifest`} className="ai-icon has-flex">
                <i>
                  <FaWpforms size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Manifest</span>
              </Link>
            </li>

            <li>
              <a onClick={() => logoutEntity(`/park_admin/logout`, history)} className="ai-icon has-flex pointer">
                <i>
                  <IoIosLogOut size={40} className="nav-icon" />
                </i>
                <span className="nav-text">Logout</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBar;
