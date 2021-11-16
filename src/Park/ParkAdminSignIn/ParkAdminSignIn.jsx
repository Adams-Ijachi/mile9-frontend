import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { TextField, PasswordField } from '../../components/FormField';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { toast } from 'react-toastify';
import { postRequest } from '../../utils/axiosClient';
import { transformToFormData, catchAxiosErrors } from '../../utils';
import localForage from '../../services/localforage';

const initialFormValues = () => {
  return {
    email: '',
    password: ''
  }
}

const parkAdminSigninSchema = object().shape({
  email: string()
    .email('Invalid Email Address')
    .required('Required'),
  password: string()
  .required('Required'),
});

const ParkAdminSignIn = () => {
  return (
    <Fragment>
    <h6 className="mb-2 text-center text-white">👋 Hello Park Admin</h6>
    <h4 className="mb-4 text-center text-white">Signin</h4>

    <Formik
      initialValues={initialFormValues()}
      validationSchema={parkAdminSigninSchema}
    >
    {props => (
      <Form>
        <div className="row">
          <div className="col-12 mb-3 col-md-12 col-lg-12">
            <label className="text-label text-white">Email</label>
            <Field name="email" as={TextField} placeholder="admin@example.com" />
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

        <CardAction values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm} />
      </Form>
    )}
    </Formik>

    {/*<div className="mt-5 card">
      <div className="pb-0 border-0 card-header">
        <h5 className="m-0 card-title text-muted fs-5">Admin Login Credentials</h5>
      </div>

      <div className="card-body">
        <div className="rounded basic-list-group bg-primary">
          <ul className="list-group">
            <li className="text-white list-group-item">Email: support@mile9ine.com</li>
            <li className="text-white list-group-item">Password: 1243Pass</li>
          </ul>
        </div>
      </div>
    </div>*/}
    </Fragment>
  );
}

const CardAction = ({ values, isValid, errors, resetForm }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const Signin = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park/login`, transformToFormData(values));

      if (data) {
        console.log(data, status, statusText);

        const forageData = {
          token: data?.token,
          isLoggedIn: true,
          type: 'park_admin'
        };

        localForage.setItem('credentials', forageData).then(() => localForage.getItem('credentials'))
        .then((val) => {
          console.log('Credentials', val)
          console.log('In localforage')
        }).catch((err) => console.error(err));

        toast.success('Logged in successful, check your email for OTP token!');
        setIsLoading(false);
        setTimeout(() => {
          resetForm();
          history.push('/park/admin/signin-otp');
        }, 4000);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div className="mt-4 text-center">
        { isLoading
          ? <ThreeDots className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
          : <button onClick={Signin} disabled={(isEmpty(errors) && isValid) ? false : true} type="button" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Sign Me In</button>
        }
      </div>
    </Fragment>
  );
}

CardAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.any,
};

export default ParkAdminSignIn;
