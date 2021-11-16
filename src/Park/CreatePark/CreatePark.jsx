import { Fragment, useState, Children, useEffect, lazy } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number } from 'yup';
import { useRecoilState } from 'recoil';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextField } from '../../components/FormField';
import { postRequest }  from '../../utils/axiosClient';
import { parkAdminAtom } from '../../recoil/parkAdmin';
import { ThreeDots } from 'react-loading-icons';
import { toast } from 'react-toastify';
import { transformToFormData, catchAxiosErrors } from '../../utils';
import localForage from '../../services/localforage';
import './CreatePark.css';
import { useHistory } from 'react-router';

const MiniFooter  = lazy(() => import(/* webpackChunkName: "Core.MiniFooter" */ '../../components/core/MiniFooter'));

const initialFormValues = () => {
  return {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    park_name: '',
    park_address: '',
    park_zip: '',
    park_city: '',
    park_state: '',
    park_contact: '',
    account_bank: '',
    account_number: '',
  };
}

const CreateParkSchema = object().shape({
  first_name: string()
    .min(4, 'Too Short!')
    .max(100, 'To Long')
    .required('Required'),
  last_name: string()
    .min(4, 'Too Short!')
    .max(100, 'To Long')
    .required('Required'),
  email: string()
    .email('Invalid Email Address')
    .required('Required'),
  password: string()
    .min(6, 'Too Short!')
    .required('Required'),
  park_name: string()
    .max(100, 'Too Long')
    .required('Required'),
  park_address: string()
    .max(150, 'Too Long')
    .required('Required'),
  park_zip: number()
    .required('Required'),
  park_city: string()
    .max(100, 'Too Long')
    .required('Required'),
  park_state: string()
    .max(100, 'Too Long')
    .required('Required'),
  park_contact: string()
    .required('Required'),
  account_bank: string()
    .min(4, 'Too Short!')
    .max(70, 'Too Long')
    .required('Required'),
  account_number: string()
    .min(10, 'Too Short and Invalid!')
    .max(10, 'Too Long and Invalid!')
    .required('Required!'),
});

export const FormStepper = ({ children }) => {
  const [step, setStep] = useState(0);
  const childrenArray = Children.toArray(children);
  const currentChild = childrenArray[step];

  return(
    <Formik
      initialValues={initialFormValues()}
      validationSchema={CreateParkSchema}
    >
      {props => (
        <Form>
          {currentChild}
          <CardActions errors={props.errors} values={props.values} childrenArr={childrenArray} handleStep={setStep} step={step} />
        </Form>
      )}
    </Formik>
  );
}

export const FormStep = ({children}) => {
  return(
    <Fragment>
      <div className="animate__animated animate__fadeIn">
        {children}
      </div>
    </Fragment>
  );
}

export const Label = ({ id, copy }) => {
  return(
    <Fragment>
      <label htmlFor={id} className="text-label fs-6">{copy}</label>
    </Fragment>
  );
}

export const CardActions = (props) => {
  const history = useHistory();
  const isFinal = () => (props.step === (props.childrenArr.length-1));
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [parkAdmin, setParkAdmin] = useRecoilState(parkAdminAtom);

  useEffect(() => {
    console.log('isValid: ', isValid);
    console.log('isFinal: ', isFinal());
    console.log('isValid: ', isValid);
  }, [props.values]);

  const isFormValid = () => {
    _.forIn(props.values, (value, key) => {
      if ((value.toString().length) > 0) {
        setIsValid(false)
      } else {
        setIsValid(true)
      }
    })
  }

  const registerPark = async (formData) => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park/register`, transformToFormData(formData));

      if (data) {
        console.log(data, status, statusText);
        console.log('Token:', data?.token)

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

        setParkAdmin(data?.park_admin);
        toast.success(`Registration successful, proceed ${data?.park_admin.email} to verify your email.`);
        console.log("state park admin: ", parkAdmin);
        console.log('Message: ', data.message);
        
        setIsLoading(false);
        setTimeout(() => {
          history.push('/park/admin/verify-email');
        }, 4000);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFinal()) {
      console.log(props.values);
      registerPark(props.values);
    } else {
      props.handleStep(s => s+1);
    }
  }

  useEffect(() => {
    isFormValid();
  }, [props.values]);

  return(
    <Fragment>
      <div className="py-4 d-flex justify-content-end">
        { (props.step > 0) ? <button onClick={() => props.handleStep(s => s-1)} type="button" className="btn btn-primary mr-2 fs-6 btn-rounded">Previous</button> : `` }
        { (!isFinal()) ? <button onClick={(e) => handleSubmit(e)} type="submit" className="btn btn-primary fs-6 btn-rounded">
          Next
        </button> : `` }

        { isLoading 
          ? <ThreeDots className="animate__animated animate__pulse" height="1em" width="3.5em" stroke="#fe634e" />
          : <button disabled={(!isValid) ? false : true} onClick={(e) => handleSubmit(e)} type="submit" className={(isFinal()) ? "btn btn-primary fs-6 btn-rounded animate__animated animate__pulse" : "btn btn-primary fs-6 btn-rounded animate__animated animate__pulse hide" }>
          Register
        </button> }
      </div>
    </Fragment>
  );
}

const CreatePark = () => {
  return (
    <Fragment>
      <div className="row form-row">
        <div className="col-xl-12 col-sm-12 col-md-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title text-warning fs-4">Register Park</h5>
            </div>

            <div className="card-body">
              <FormStepper>
                <FormStep>
                  <h3 className="text-muted fs-5">Personal Information</h3>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"first_name"} copy={"First Name*"} />
                        <Field type="text" name="first_name" as={TextField} placeholder="John" />
                        <ErrorMessage name="first_name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"last_name"} copy={"Last Name*"} />
                        <Field type="text" name="last_name" as={TextField} placeholder="Snow" />
                        <ErrorMessage name="last_name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"email"} copy={"Email*"} />
                        <Field type="email" name="email" as={TextField} placeholder="snow@mile9ine.com" />
                        <ErrorMessage name="email">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"password"} copy={"Password*"} />
                        <Field type="password" name="password" as={TextField} placeholder="******" />
                        <ErrorMessage name="password">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>
                </FormStep>

                <FormStep>
                  <h3 className="text-muted fs-5">Park Details</h3>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"park_name"} copy={"Park Name*"} />
                        <Field type="text" name="park_name" as={TextField} placeholder="e.g G&G Logistics & Transport LTD" />
                        <ErrorMessage name="park_name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"park_address"} copy={"Park Address*"} />
                        <Field type="text" name="park_address" as={TextField} placeholder="e.g Address" />
                        <ErrorMessage name="park_address">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"park_zip"} copy={"Park Zip Code*"} />
                        <Field type="text" name="park_zip" as={TextField} placeholder="e.g 930164" />
                        <ErrorMessage name="park_zip">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"park_city"} copy={"Park City*"} />
                        <Field type="text" name="park_city" as={TextField} placeholder="e.g Jos" />
                        <ErrorMessage name="park_city">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <Label id={"park_state"} copy={"Park State*"} />
                      <Field type="text" name="park_state" as={TextField} placeholder="e.g Plateau" />
                      <ErrorMessage name="park_state">
                        {msg => <div className="error-msg text-warning">{msg}</div>}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <Label id={"park_contact"} copy={"Park Contact*"} />
                      <Field type="text" name="park_contact" as={TextField} placeholder="e.g 90 9854321" />
                      <ErrorMessage name="park_contact">
                        {msg => <div className="error-msg text-warning">{msg}</div>}
                      </ErrorMessage>
                    </div>
                  </div>
                  </div>

                </FormStep>

                <FormStep>
                  <h3 className="text-muted fs-5">Park Bank Details</h3>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"account_bank"} copy={"Bank Name*"} />
                        <Field type="text" name="account_bank" as={TextField} placeholder="e.g Access Bank PLC" />
                        <ErrorMessage name="account_bank">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <Label id={"account_number"} copy={"Account Number*"} />
                        <Field type="number" name="account_number" as={TextField} placeholder="e.g 0009999999" />
                        <ErrorMessage name="account_number">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                  </div>
                </FormStep>
              </FormStepper>
            </div>
          </div>
        </div>
      </div>
      <MiniFooter className="mini-footer" />
    </Fragment>
  );
}

FormStepper.propTypes = {
  children: PropTypes.node
}
FormStep.propTypes = {
  children: PropTypes.node
}
Label.propTypes = {
  id: PropTypes.string,
  copy: PropTypes.string
}

export default CreatePark;
