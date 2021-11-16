import { Fragment, useEffect, useState, createRef } from 'react'
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number } from 'yup';
import { ThreeDots } from 'react-loading-icons';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { TextField } from '../../FormField'
import _, { isEmpty } from 'lodash';
import { useRecoilState } from 'recoil';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { parkBusesAtom } from '../../../recoil/parkBuses';
import './AddBus.css';
import 'animate.css';


const initialFormValues = () => {
  return {
    plate_number: '',
    type: '',
    capacity: 0,
    bus_condition: 'good'
  };
}

const addBusSchema = object().shape({
  plate_number: string()
    .min(4, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  type: string()
    .min(3, 'Too short')
    .max(70, 'Too Long')
    .required('Required'),
  capacity: number()
    .min(1, 'Too Short')
    .required('Required'),
});

export const ModalAction = ({ values, isValid, errors, resetForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parkBuses, setParkBuses] = useRecoilState(parkBusesAtom);
  console.log('Add Bus Components Atom State: ', parkBuses);
  const closeModalRef = createRef();

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const updateParkBuses = (newBus) => {
    setParkBuses(buses => [...buses, newBus]);
    console.log('success');
  }

  const addParkBus = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/create-park_bus`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log(data?.data, status, statusText);
        updateParkBuses(data?.data);
        toast.success(`Bus Added Successfully!`);
        setIsLoading(false);
        resetForm();
        console.log('Element: ', closeModalRef);
        setTimeout(() => {
          document.getElementById("close_bus_modal").click();
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button ref={closeModalRef} id="close_bus_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={addParkBus} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
        }
      </div>
    </Fragment>
  );
}

export const AddBus = () => {
  return (
    <Fragment>
      <span data-toggle="modal" data-target="#basicModalBus" className="add-menu-sidebar add__btn">
        <IoAddOutline size={'18px'} className="text-white mr-3" />
        <span>Add Bus</span>
      </span>

      <div className="modal fade" tabIndex={-1} id="basicModalBus">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Park Bus</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="modal-body text-left">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={addBusSchema}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="plate_number" className="text-label fs-6 m-0">Plate Number</label>
                        <Field type="text" name="plate_number" as={TextField} placeholder="e.g ll-682yh" />
                        <ErrorMessage name="plate_number">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="type" className="text-label fs-6 m-0">Bus Type</label>
                        <Field type="text" name="type" as={TextField} placeholder="e.g Travel Bus" />
                        <ErrorMessage name="type">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="capacity" className="text-label fs-6 m-0">Bus Capacity</label>
                        <Field type="number" name="capacity" as={TextField} placeholder="e.g 50" />
                        <ErrorMessage name="capacity">
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
  );
}

ModalAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func,
}

export default AddBus;
