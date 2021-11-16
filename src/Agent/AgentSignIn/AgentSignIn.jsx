import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Fragment, useState, useEffect } from 'react';
import ThreeDots from 'react-loading-icons/dist/components/three-dots';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import _, { isEmpty } from 'lodash';
import { TextField, PasswordField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData } from '../../utils';
import './AgentSigIn.css';
import { postRequest } from '../../utils/axiosClient';
import localForage from '../../services';
import { toast } from 'react-toastify';
import { parkAgentAtom } from '../../recoil/ParkAgent';
import { useRecoilState } from 'recoil';

const initialFormValues = () => {
  return {
    email: '',
    password: '',
  };
}

const agentSigninSchema = object().shape({
  email: string()
    .email('Invalid Email')
    .required('Required'),
  password: string()
    .min(6, 'Too Short')
    .required('Required'),
});

export const AgentSignInCardFooter = ({ values, isValid, errors, ErrorMessage, resetForm }) => {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [parkAgent, setParkAgent] = useRecoilState(parkAgentAtom);

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const SignIn = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText} = await postRequest(`/park/user/login`, transformToFormData(values));

      if (data) {
        console.log(data, status, statusText);
        console.log('Sigin State:', parkAgent);
        setParkAgent(data?.user);

        const forageData = {
          token: data?.token,
          isLoggedIn: true,
          type: _.get(data, 'user.type', null)
        }

        localForage.setItem('credentials', forageData).then(() => localForage.getItem('credentials'))
        .then((val) => {
          console.log('Credentials', val)
          console.log('In localforage')
        }).catch((err) => console.error(err));

        toast.success(`Logged in successfully!`);
        setIsLoading(false);
        if (_.get(data, 'user.type', null) === "agent") {
          setTimeout(() => {
            resetForm();
            history.push('/park/staff/dashboard');
          }, 4000);
        }
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-4 text-center">
        {isLoading
          ? <ThreeDots  className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
          : <button onClick={SignIn} disabled={(isEmpty(errors) && isValid) ? false : true} type="button" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Sign Me In</button>
        }
      </div>
    </Fragment>
  );
}

const AgentSignIn = () => {
  return (
    <Fragment>
      <h6 className="mb-2 text-center text-white">👋 Hello Park Staff</h6>
      <h4 className="mb-4 text-center text-white">Signin</h4>

      <Formik
        initialValues={initialFormValues()}
        validationSchema={agentSigninSchema}
      >
        {props => (
          <Form>
            <div className="row">
              <div className="col-sm-12 col-md-12 mb-3">
                <label className="text-label text-white">Email</label>
                <Field name="email" as={TextField} placeholder="snow@example.com" />
                <ErrorMessage name="email">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-12 mb-3 col-md-12 col-lg-12">
                <label className="text-label text-white">Password</label>
                <Field name="password" as={PasswordField} placeholder="*******" />
                <ErrorMessage name="password">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>

            <AgentSignInCardFooter 
              values={props.values}
              isValid={props.isValid}
              errors={props.errors}
              resetForm={props.resetForm}
            />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}

AgentSignInCardFooter.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.any,
};

export default AgentSignIn;
