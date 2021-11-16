import { Fragment, useState } from "react";
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import PropTypes from 'prop-types';
import './FormField.css';
import 'animate.css';

export const TextField = (props) => {
  return(
    <Fragment>
      <input className="form-control" {...props} />
    </Fragment>
  );
}

// export const SelectField = ({ name, options, classes }) => {

//   console.log('Bus Options:', options);
//   return (
//     <Fragment>
//       <div className="form-group col-md-4">
//         <select name={name} className={classes}>
//           <option disabled>Choose...</option>
//           {options.map((option) => (
//             <option key={option?.id} value={option?.id}>{option?.plate_number}</option>
//           ))}
//         </select>
//       </div>
//     </Fragment>
//   );
// }

export const PasswordField = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Fragment>
      <div className="password-container">
        <input type={isVisible ? "text" : "password"} className="form-control input-password" {...props} />
        { isVisible
          ? <AiOutlineEye onClick={() => setIsVisible(!isVisible)} size="20px" className="input-append text-primary animate__animated animate__pulse" />
          : <AiOutlineEyeInvisible onClick={() => setIsVisible(!isVisible)} size="20px" className="input-append text-primary animate__animated animate__pulse" />
        }
      </div>
    </Fragment>
  );
}




