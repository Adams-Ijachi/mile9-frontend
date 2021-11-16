import { useState } from 'react';
import { useHistory } from 'react-router';
import LoadScripts from '../Hooks/loadScripts';

const SignUp = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");

  const history = useHistory();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h4 className="mb-4 text-center text-white">Sign up your account</h4>
      <form>
          <div className="form-group">
              <label className="mb-1 text-white"><strong>Username</strong></label>
              <input type="text" onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="username" value={username} />
          </div>

          <div className="form-group">
              <label className="mb-1 text-white"><strong>Email</strong></label>
              <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="hello@example.com" value={email} />
          </div>

          <div className="form-group">
              <label className="mb-1 text-white"><strong>Password</strong></label>
              <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" value={password} />
          </div>

          <div className="mt-4 text-center">
              <button type="submit" className="bg-white btn text-primary btn-block">Sign me up</button>
          </div>
      </form>

      <div className="mt-3 new-account">
        <p className="text-white">Already have an account? <span className="text-white link" onClick={() => history.push('/signin')}>Sign in</span></p>
      </div>
    </>
  );
}

export default SignUp;
