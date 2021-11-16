import { Fragment, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FastField } from 'formik';
import { object, string, number } from 'yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FaAddressBook } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import { TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData } from '../../utils';
import { toast } from 'react-toastify';
import './AgentBookUser.css';
import 'animate.css';

const initialFormValues = (rId) => {
  return {
    seats: 0,
    leaving_date: '',
    returning_date: null,
    travel_type: '',
    ride_bus_id: rId,
  };
}

const bookUserSchema = object().shape({
  seats: number()
    .min(0, 'Does Exists')
    .required('Required'),
  leaving_date: string()
    .required('Required'),
  returning_date: string()
    .required('Required'),
  travel_type: string()
    .required('Requried'),
});

export const AgentBookUserModalAction = ({ values, isValid, errors, resetForm }) => {

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(values);
  }, [values]);

  const bookCustomers = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_agent/book-for-customer`, transformToFormData(values), {
        headers: { authorization: `${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`Booked Successfully`);

        setTimeout(() => {
          resetForm();
          document.getElementById("close_agentBookUSer_modal").click();
        });
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);    
    }
  }


  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button type="button" id="close_agentBookUSer_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={bookCustomers} type="button" disabled={(_.isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Create Schedule</button>
        }
      </div>
    </Fragment>
  );
}

const AgentBookUser = () => {
  return (
    <Fragment>
      <span data-toggle="modal" data-target="#basicModalAgentBooking" className="add-menu-sidebar add__btn">
        <FaAddressBook size={'20px'} className="text-white mr-3" />
        <span>Book Customers</span>
      </span>

      <div id="basicModalAgentBooking" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Book Customers</h5>
              <button className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="modal-body text-left">
              <Formik
                initialValues={initialFormValues(1)}
                validationSchema={bookUserSchema}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="seat" className="text-label fs-5 m-0">Seat</label>
                        <Field name="seat" type="number" as={TextField} placeholder="e.g 5" />
                        <ErrorMessage name="seat">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="leaving_date" className="text-label fs-5 m-0">Travel Date</label>
                        <Field name="leaving_date" type="date" as={TextField} placeholder="e.g 02-10-2021" />
                        <ErrorMessage name="leaving_date">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="leaving_date" className="text-label fs-5 m-0">Travel Type</label>
                        <FastField name="travel_type">
                          {({ field }) => (
                            <select className="form-control" {...field}>
                              <option defaultValue="">Choose...</option>
                              <option value="one_way">One Way</option>
                              <option value="two_way">Two Way</option>
                            </select>
                          )}
                        </FastField>
                        <ErrorMessage name="leaving_date">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      { (_.get(props, 'values.travel_type', null) === "two_way")
                          ? <div className="col-sm-12 col-md-12 mb-3">
                              <label htmlFor="returning_date" className="text-label fs-5 m-0">Return Date</label>
                              <Field name="returning_date" type="date" as={TextField} placeholder="e.g 02-10-2021" />
                              <ErrorMessage name="returning_date">
                                {msg => <div className="error-msg text-danger">{msg}</div>}
                              </ErrorMessage>
                            </div>
                          : ``
                      }
                    </div>

                      <AgentBookUserModalAction 
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

AgentBookUserModalAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func,
}

export default AgentBookUser;
