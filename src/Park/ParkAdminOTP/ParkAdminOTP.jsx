import { Fragment, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { each, forOwn, isEmpty, size } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { useRecoilState } from 'recoil';
import { parkAdminAtom } from '../../recoil/parkAdmin';
import { TextField } from '../../components/FormField';
import MiniFooter from '../../components/core/MiniFooter';
import { getRequest, postRequest } from '../../utils/axiosClient';
import { catchAxiosErrors, getToken, transformToFormData } from '../../utils'
import './parkAdminOTP.css';

const inintialFormValues = () => {
  return {
    otp: ''
  }
};

const otpSchema = object().shape({
  otp: string()
    .min(5, 'Too Short, and Invalid!')
    .max(5, 'Too Long and Invalid')
    .required('Required'),
});

const ParkAdminOTP = () => {
  return (
    <Fragment>
      <h4 className="text-center mb-4 text-white">Account Locked</h4>
      <Formik
        initialValues={inintialFormValues()}
        validationSchema={otpSchema}
      >
        {props => (
          <Form>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-12">
                <label className="text-label text-white">OTP Token</label>
                <Field type="number" name="otp" as={TextField} placeholder="00000"  />
                <ErrorMessage name="otp">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>

            <div className="card-grid">
              <CardAction values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm}  />
            </div>
          </Form>
        )}
      </Formik>

      <RedendOTP />

      <MiniFooter className="auth-footer" />
    </Fragment>
  );
}

const CardAction = ({ values, isValid, errors, resetForm }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false); 
  const [parkAdmin, setParkAdmin] = useRecoilState(parkAdminAtom);

  useEffect(() => {
    console.log(values, isValid, errors);
    console.log((values.otp).toString().length);
  }, [values]);

  const VerifyOTP = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText }  = await postRequest(`/park_admin/verify-otp`, transformToFormData(values), {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });

      if (data) {
        setParkAdmin(data?.park_admin);
        console.log(data, status, statusText);
        console.log('From State Park: ', parkAdmin);
        toast.success(`Authentication successful, cheers 🥂`, {
          position: "top-center"
        });
        setIsLoading(false);
        setTimeout(() => {
          resetForm();
          history.push('/park/admin/dashboard');
        }, 4000);
      }
    } catch (err) {
      let msg = typeof err.response !== (undefined || null) ? err.response.data.message : err.message;
      console.debug("error", msg)
      setIsLoading(false);

      if (Array.isArray(msg)) {
        each(msg, (val) => {
          toast.error(val, { autoClose: 6000, position: "top-center" });
        });
      } else if (typeof msg === 'object') {
        forOwn(msg, (val, key) => {
          toast.error(val[0], { autoClose: 6000, position: "top-center" });
          console.log(key, val[0]);
        })
      } else if (typeof msg === 'string') {
        toast.error(msg, { autoClose: 6000, position: "top-center" });
      } else {
        toast.error(`An error occured, please try again.`);
      }
    }
  }

  return (
    <Fragment>
      <div className="mt-4 text-center">
        { isLoading
          ? <ThreeDots className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
          : <button onClick={VerifyOTP} disabled={(isEmpty(errors) && isValid && ((values.otp).toString().length) === 5) ? false : true} type="submit" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Unlock</button> 
        }
      </div>
    </Fragment>
  );
}

const RedendOTP = () => {
  const [isLoading, setIsLoading] = useState(false);

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await getRequest(`/park_admin/resend-otp`, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`OTP Token successfully sent, check your mail!`, 
        {position: 'top-center',});
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 action-flex">
        <span className="text-light">Didn't get OTP Token?</span>
        { isLoading
          ? <ThreeDots className="animate__animated animate__pulse ml-3" height="1em" width="4em" stroke="#ffffff" />
          : <button onClick={resendOtp} type="button" className="btn btn-link text-light animate__animated animate__pulse">Resend</button>
        }
      </div>
    </Fragment>
  );
}

CardAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  values: PropTypes.object,
  resetForm: PropTypes.any,
};

export default ParkAdminOTP;
