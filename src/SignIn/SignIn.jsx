import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadScripts from '../Hooks/loadScripts';
import './SignIn.css';

const SignIn = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");

  const history  = useHistory();

  const [email, setEmail] = useState("hello@example.com");
  const [password, setPassword] = useState("Password");

  return (
    <>
      <h4 className="mb-4 text-center text-white">Sign in your account</h4>
      <form>
        <div className="form-group">
          <label className="mb-1 text-white"><strong>Email</strong></label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" value={email} />
        </div>

        <div className="form-group">
          <label className="mb-1 text-white"><strong>Password</strong></label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" value={password} />
        </div>

        <div className="mt-4 mb-2 form-row d-flex justify-content-between">
          <div className="form-group">
            <div className="ml-1 text-white custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="basic_checkbox_1" />
              <label className="custom-control-label" htmlFor="basic_checkbox_1">Remember my preference</label>
            </div>
          </div>

          <div className="form-group">
            <span className="text-white link" onClick={() => history.push('/')}>Forgot Password?</span>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-white btn text-primary btn-block">Sign Me In</button>
        </div>
      </form>

      <div className="mt-3 new-account">
        <p className="text-white">Don't have an account? <span className="text-white link" onClick={() => history.push('/signup')}>Sign up</span></p>
      </div>
    </>
  );
}

export default SignIn;
