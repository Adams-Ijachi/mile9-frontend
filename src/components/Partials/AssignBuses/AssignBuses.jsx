import { Fragment, createRef, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FastField } from 'formik';
import { object, string, number } from 'yup';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useRecoilState } from 'recoil';
import parkBusesAtom from '../../../recoil/parkBuses';
import parkDriversAtom from '../../../recoil/parkDrivers';
import parkRidesAtom from '../../../recoil/parkRides';
import { TextField } from '../../FormField';
import { catchAxiosErrors } from '../../../utils';

const initailFormValues = () => {
  return {
    ride_name: '',
    ride_type: '',
    park_bus_id: '',
    driver_id: '',
    park_rides_id: '',
  };
}

const assignBusesSchema = object().shape({
  ride_name: string()
    .min(4, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
  ride_type: string()
    .min(4, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
  park_bus_id: number()
    .min(0, 'Invalid Bus')
    .required('Required'),
  driver_id: number()
    .min(0, 'Invalid Driver')
    .required('Required'),
  park_rides_id: number()
    .min(0, 'Invalid Ride')
    .required('Required'),
});

const ModalRidesActions = ({ values, isValid, errors }) => {
  const [isLoading, setIsLoading] = useState(false);

  const assignBuses = () => {
    try {
      console.log('Values: ', values);
      
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <div className="mt-3 d-flex justify-content-end align-items-center">
      <button type="button" id="close_driver_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
      { isLoading
        ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
        : <button onClick={assignBuses} type="button" disabled={(!isEmpty(values)) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
      }
    </div>
  );
}
const AssignBuses = () => {

  const [parkBuses] = useRecoilState(parkBusesAtom);
  const [parkDrivers] = useRecoilState(parkDriversAtom);
  const [parkRides] = useRecoilState(parkRidesAtom);

  console.log('Buses: ', parkBuses);
  console.log('Drivers: ', parkDrivers);

  return (
    <Fragment>
      <span data-toggle="modal" data-target=".basicAssignModal" className="add-menu-sidebar add__btn">
        <IoAddOutline size={'18px'} className="text-white mr-3" />
        <span>Add Driver</span>
      </span>

      <div className="modal fade basicAssignModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Buses</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body text-left">
              <Formik
                initialValues={initailFormValues()}
                validationSchema={assignBusesSchema}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 text-left mb-3">
                        <label htmlFor="ride_name" className="text-label fs-6 m-0">Ride Name</label>
                        <Field name="ride_name" type="text" as={TextField} placeholder="e.g Bus 1 Abj to Lag" />
                        <ErrorMessage name="ride_name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 text-left mb-3">
                        <label htmlFor="ride_type" className="text-label fs-6 m-0">Ride Type</label>
                        <Field name="ride_type" type="text" as={TextField} placeholder="e.g 4 by 4" />
                        <ErrorMessage name="ride_type">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 text-left mb-3">
                        <label htmlFor="park_rides_id" className="text-label fs-6 m-0">Park Rides</label>
                        <FastField name="park_rides_id">
                          {({ field, form, meta }) => (
                            <select className="form-control" {...field}>
                              <option defaultValue={''} disabled>Choose...</option>
                              {parkRides.map((ride) => (
                                <option key={ride?.id} value={ride?.id}>{`${ride?.starting_point} | ${ride?.destination}`}</option>
                              ))}
                            </select>
                          )}
                        </FastField>
                      </div>

                      <div className="col-sm-12 col-md-12 text-left mb-3">
                        <label htmlFor="ride_type" className="text-label fs-6 m-0">Park Buses</label>
                        <FastField name="park_bus_id">
                          {({ field, form, meta }) => (
                            <select className="form-control" {...field}>
                              <option defaultValue={''} disabled>Choose...</option>
                              {parkBuses.map((bus) => (
                                <option key={bus?.id} value={bus?.id}>{`${bus?.plate_number} | ${bus?.capacity}`}</option>
                              ))}
                            </select>
                          )}
                        </FastField>
                      </div>

                      <div className="col-sm-12 col-md-12 text-left mb-3">
                        <label htmlFor="driver_id" className="text-label fs-6 m-0">Park Drivers</label>
                        <FastField name="driver_id">
                          {({ field, form, meta }) => (
                            <select  className="form-control" {...field}>
                              <option defaultValue={''} disabled>Choose...</option>
                              {parkDrivers.map((driver) => (
                                <option key={driver?.id} value={driver?.id}>{driver?.user.name}</option>
                              ))}
                            </select>
                          )}
                        </FastField>
                      </div>
                    </div>
                    
                    <ModalRidesActions values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm} />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AssignBuses;
