import { Fragment, useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { object, string } from 'yup';
import { PasswordField, TextField } from '../../FormField';
import { useRecoilValue, useRecoilState } from 'recoil';
import  PropTypes from 'prop-types';
import { withParkId } from '../../../recoil/parkAdmin';
import { parkStaffAtom } from '../../../recoil/parkStaff';
import _ from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import './AddStaff.css';
import 'animate.css';

const initialFormValues = (pId) => {
  return {
    name: '',
    email: '',
    password: '',
    park_id: pId,
  };
}

const addStaffSchema = object().shape({
  name: string()
    .min(4, 'Too Short')
    .max(70, 'Too long')
    .required('Required'),
  email: string()
    .email('Invalid Email Address')
    .required('requried'),
  password: string()
    .min(6, 'Not Strong')
    .required('Required'),
});

export const AddStaffModalAction = ({ values, isValid, errors, resetForm }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkStaff, setParkStaff] = useRecoilState(parkStaffAtom);

  console.log('Add Staff Component Atom State: ', parkStaff);

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const updateParkStaff = (newStaff) => {
    setParkStaff(staff => [...staff, newStaff]);
    console.log('success');
  }

  const addparkStaff = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/create-agent`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log(data?.data);
        updateParkStaff(data?.data)
        toast.success(`Park staff Added Successfully!`);
        setIsLoading(false);
        resetForm();
        setTimeout(() => {
          document.getElementById("close_addpark_staff_modal").click();
        });
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button id="close_addpark_staff_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={addparkStaff} type="button" disabled={(_.isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
        }
      </div>
    </Fragment>
  );
}

const AddStaff = () => {

  const parkId = useRecoilValue(withParkId);

  console.log('Park ID: ', parkId);

  return (
    <Fragment>
        <span className="add-menu-sidebar add__btn" data-toggle="modal" data-target="#basicModalStaff">
          <IoAddOutline size={'18px'} className="text-white mr-3" />
          <span>Add Staff</span>
        </span>

        <div className="modal fade" tabIndex={-1} id="basicModalStaff">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Add Park Staff</div>
                <button type="button" className="close" data-dismiss="modal">
                  <AiOutlineCloseCircle />
                </button>
              </div>

              <div className="modal-body text-left">
                <Formik
                  initialValues={initialFormValues(_.get(parkId, 'id', null))}
                  validationSchema={addStaffSchema}
                >
                  {props => (
                    <Form>
                      <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="name" className="text-label fs-6 m-0">Staff Name</label>
                          <Field type="text" name="name" as={TextField} placeholder="e.g John Deo" />
                          <ErrorMessage name="name">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="email" className="text-label fs-6 m-0">Staff Email</label>
                          <Field type="email" name="email" as={TextField} placeholder="e.g deo@gmail.com" />
                          <ErrorMessage name="email">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="password" className="text-label fs-6 m-0">Staff Password</label>
                          <Field name="password" as={PasswordField} placeholder="******" />
                          <ErrorMessage name="password">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      <AddStaffModalAction
                        values={props.values}
                        isValid={props.isValid}
                        errors={props.errors}
                        resetForm={props.resetForm}
                      />
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

AddStaffModalAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func,
}

export default AddStaff;
