import { Fragment, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { GiBus, GiSteeringWheel } from 'react-icons/gi'; 
import PropTypes from 'prop-types';
import { isEmpty, isLength } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { toast } from 'react-toastify';
import { catchAxiosErrors, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import './ScheduleList.css';
import 'animate.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import parkRidesAtom, { withParkRidesQuery} from '../../../recoil/parkRides';

const ScheduleList = ({ sId, buses }) => {

  // const [assignRides, setAssignRides] = useRecoilState(parkRidesAtom);
  const assignRides = useRecoilValue(withParkRidesQuery);
  const [isloading, setIsLoading] = useState(false);

  const updateState = (busId) => {
    // setAssignRides(assignRides[sId]?.buses.filter(item.id !== busId));
    console.log(assignRides);
  }

  const removeRide = async (busId) => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/delete-ride-bus/${busId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });
      if (data) {
        console.log(data, status, statusText);
        toast.success(`Deleted Successfully!`);
        updateState(busId);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      {isEmpty(buses)
        ? <div className="text-center text-muted">No Buses Assigned yet!</div>
        : <ul className="mt-3">
            {buses.map((bus) => (
              <li key={bus.id} className="card bg-danger-light m-0 p-4 mb-2 list-card">
                <div className="list-flex">
                  <div className="d-flex align-items-center m-0">
                    <GiBus className="text-primary m-0 mr-2" size={`25px`} />
                    <span className="fs-6 text-black m-0">{`${bus.ride_name} | ${bus.ride_type}`}</span>
                  </div>
                </div>

                { isloading
                    ? <ThreeDots id={`removerRide${sId}loader${bus.id}`} className="animate__animated animate__pulse" height="1.5em" width="3em" stroke="#0C0100" />
                    : <MdDelete id={`removerRide${sId}loader${bus.id}`} onClick={() => removeRide(bus.id)} className="animate__animated animate__pulse text-black pointer list-actions" size={`28px`} />
                }
              </li>
            ))}
          </ul>
      }
      
    </Fragment>
  );
}

ScheduleList.propTypes = {
  buses: PropTypes.array,
}

export default ScheduleList;
