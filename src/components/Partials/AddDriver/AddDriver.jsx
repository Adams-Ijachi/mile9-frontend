import { Fragment, createRef, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useRecoilState } from 'recoil';
import { catchAxiosErrors, getToken, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { TextField } from '../../FormField';
import { parkDriversAtom } from '../../../recoil/parkDrivers'
import './AddDriver.css';
import 'animate.css';

const initialFormValues = () => {
  return {
    name: '',
    email: '',
    password: 'pass1234',
    address: '',
  };
}

const addDriverSchema = object().shape({
  name: string()
    .min(4, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  email: string()
    .email('Invalid Email')
    .required('Required'),
  address: string()
    .min(4, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
});

export const ModalAction = ({ values, isValid, errors, resetForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parkDrivers, setParkDrivers] = useRecoilState(parkDriversAtom);
  const closeModalRef = createRef();

  console.log('Add Driver Component Atom State: ', parkDrivers);

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const updateParkDrivers = (newDriver) => {
    setParkDrivers(drivers => [...drivers, newDriver]);
    console.log('success');
  }

  const addParkDriver = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/create-park_driver`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}`}
      });

      if (data) {
        console.log(data, status, statusText);
        console.log(data?.data.user)
        updateParkDrivers(data?.data.user);
        toast.success(`Driver Added Successfully!`);
        setIsLoading(false);
        resetForm();
        setTimeout(() => {
          document.getElementById("close_driver_modal").click();
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button ref={closeModalRef} type="button" id="close_driver_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={addParkDriver} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
        }
      </div>
    </Fragment>
  );
}

const AddDriver = () => {
  return (
    <Fragment>
      <span data-toggle="modal" data-target="#basicModal" className="add-menu-sidebar add__btn">
        <IoAddOutline size={'18px'} className="text-white mr-3" />
        <span>Add Driver</span>
      </span>

      <div id="basicModal" className="modal fade">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Park Driver</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body text-left">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={addDriverSchema}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="name" className="text-label fs-6 m-0">Driver's Full Name</label>
                        <Field type="text" name="name" as={TextField} placeholder="e.g John Snow" />
                        <ErrorMessage name="name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="email" className="text-label fs-6 m-0">Driver's Email</label>
                        <Field type="email" name="email" as={TextField} placeholder="e.g snow@example.com" />
                        <ErrorMessage name="email">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="address" className="text-label fs-6 m-0">Driver's Address</label>
                        <Field type="text" name="address" as={TextField} placeholder="e.g snow@example.com" />
                        <ErrorMessage name="address">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <ModalAction values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm} />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

ModalAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func,
}

export default AddDriver;
