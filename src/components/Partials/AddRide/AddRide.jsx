import { Fragment, createRef, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number } from 'yup';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useRecoilState } from 'recoil';
import { TextField } from '../../FormField';
import { catchAxiosErrors, getToken, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import parkRidesAtom from '../../../recoil/parkRides';
import './AddRide.css';
import 'animate.css';

const initialFormValues = () => {
  return {
    starting_point: "",
    destination: "",
    price: 0,
    ride_description: "",
  };
}

const createRideSchema = object().shape({
  starting_point: string()
    .min(3, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  destination: string()
    .min(3, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  price: number()
    .required('Required'),
  ride_description: string()
    .min(5, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
});

export const RideModalAction = ({ values, isValid, errors, resetForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parkRides, setParkRides] = useRecoilState(parkRidesAtom);
  const closeModalRef = createRef();

  console.log('Add Driver Component Atom State: ', parkRides);

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const updateParkRides = (newRide) => {
    setParkRides(rides => [...rides, newRide]);
    console.log('success');
  }

  const createParkRide = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/create-ride`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}`}
      });

      if (data) {
        console.log(data, status, statusText);
        updateParkRides(data?.data);
        toast.success(`Schedule Created Successfully!`);
        setIsLoading(false);
        resetForm();
        setTimeout(() => {
          document.getElementById("close_ride_modal").click();
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button ref={closeModalRef} type="button" id="close_ride_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={createParkRide} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Create Schedule</button>
        }
      </div>
    </Fragment>
  );
}

const AddRide = () => {
  return (
    <Fragment>
      <span data-toggle="modal" data-target="#addOrderModalside" className="add-menu-sidebar add__btn">
        <IoAddOutline size={'18px'} className="text-white mr-3" />
        <span>Create Schedule</span>
      </span>

      <div className="modal fade" id={`addOrderModalside`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Park Travel Schedule</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body text-left">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={createRideSchema}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="starting_point" className="text-label fs-6 m-0">Starting Point</label>
                        <Field type="text" name="starting_point" as={TextField} placeholder="e.g Abuja" />
                        <ErrorMessage name="starting_point">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="destination" className="text-label fs-6 m-0">Destination</label>
                        <Field type="text" name="destination" as={TextField} placeholder="e.g Jos" />
                        <ErrorMessage name="destination">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="price" className="text-label fs-6 m-0">Price</label>
                        <Field type="number" name="price" as={TextField} placeholder="e.g 5000" />
                        <ErrorMessage name="price">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="ride_description" className="text-label fs-6 m-0">Ride Description</label>
                        <Field type="text" name="ride_description" as={TextField} placeholder="e.g Lagos" />
                        <ErrorMessage name="ride_description">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <RideModalAction values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm} />
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

RideModalAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func,
}

export default AddRide;
