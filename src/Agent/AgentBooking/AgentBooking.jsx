import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import _, { isEmpty } from 'lodash';
import LoadScripts from '../../Hooks/loadScripts';
import { TextField } from '../../components/FormField';
import { ThreeDots } from 'react-loading-icons';
import { AiOutlineCloseCircle, AiOutlineIssuesClose } from 'react-icons/ai';
import{ BsCheckCircle } from 'react-icons/bs';
import { getToken, catchAxiosErrors, transformToFormData } from '../../utils'
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import './AgentBooking.css';
import 'animate.css';

const initialFormValues = () => {
  return {
    booking_code: '',
  }
}

const agentBookingSchema = object().shape({
  booking_code: string()
    .required('Required'),
});

export const AgentCardActions = ({ values, isValid, errors, resetForm }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  const verifyBookingCode = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_agent/verify/booking`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      })

      if (data) {
        console.log(data, status, statusText);
        setBooking(data?.booking);
        toast.success(`Customer Verified Successfully!`)
        document.getElementById("bookingVerified").click();
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading)
    }
  }

  return (
    <Fragment>
      { isLoading
        ? <div className="d-flex justify-content-center"><ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /></div>
        : <button onClick={verifyBookingCode} type="button" disabled={(isEmpty(errors) && isValid && _.size(_.get(values, 'booking_code')) > 0) ? false : true} className="btn btn-primary btn-block animate__animated animate__pulse">Verify Code</button>
      }

      <button data-toggle="modal" data-target="#verificationModal" className="hidden hide" id="bookingVerified"></button>

      <div className="modal fade" id="verificationModal" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="card-modal bg-white">
              <div className="card-modal__header bg-primary d-flex justify-content-between  ">
                <h5 className="text-white modal-title">Verification Confirmation</h5>
                <button type="button" className="close text-white" data-dismiss="modal">
                  <AiOutlineCloseCircle size={"20px"} />
                </button>
              </div>

              <div className="card-modal__body p-4 bg-white">

                <div className="row">
                  <h5 className="text-uppercase saluation col-sm-12 col-md-12">Booking Details</h5>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">SEAT: </p>
                      <p className="m-0 font-w600 badge badge-circle badge-danger">{_.get(booking, 'seats', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Booking Date: </p>
                      <p className="m-0 font-w600">{_.get(booking, 'booking_date', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Amount: </p>
                      <p className="m-0 font-w600">{_.get(booking, 'fare_amount', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Booking Code: </p>
                      <p className="m-0 font-w600 badge badge-primary">{_.get(booking, 'booking_code', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Travel Type: </p>
                      <p className="m-0 font-w600">{_.get(booking, 'travel_type', null)}</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className={`card px-4 py-2 rounded-sm text-black ${_.get(booking, 'status', null) ? "bg-success-light" : "bg-danger-light"}`}>
                      <p className="m-0">Verified: </p>
                      {_.get(booking, 'status', null)
                        ? <BsCheckCircle className="text-success" size={"30px"} />
                        : <AiOutlineIssuesClose className="text-danger" size={"30px"} />
                      }
                    </div>
                  </div>


                  <h5 className="text-uppercase saluation col-sm-12 col-md-12 mt-3">Bus Details</h5>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Ride Name: </p>
                      <p className="m-0 font-w600">Bus 1 Abj to Lag</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Ride Type: </p>
                      <p className="m-0 font-w600">4 by 4</p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4">
                    <div className="card bg-danger-light px-4 py-2 rounded-sm text-black">
                      <p className="m-0">Available Space : </p>
                      <p className="m-0 font-w600 bagde badge-circle badge-primary text-center">100</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-2">
                  <button data-dismiss="modal" className="btn btn-danger light">Close</button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
}

const AgentBooking = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  return (
    <Fragment>
      <h4 className="overline text-uppercase">Verify Booking Code</h4>
      
      <div className="card mt-3">
        <div className="card-body">
          <Formik
            initialValues={initialFormValues()}
            validationSchema={agentBookingSchema}
          >
            {props => (
              <Form>
                <div className="row">
                  <div className="col-xl-12 col-sm-12 mb-3">
                    <label htmlFor="booking_code" className="text-label m-0 fs-5 mb-2">Verify Customer</label>
                    <Field name="booking_code" as={TextField} placeholder="e.g j2a844ttjn" />
                    <ErrorMessage name="booking_code">
                      {msg => <div className="error-msg text-warning">{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>

                <AgentCardActions 
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
      
    </Fragment>
  );
}

AgentCardActions.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.func
}

export default AgentBooking;
