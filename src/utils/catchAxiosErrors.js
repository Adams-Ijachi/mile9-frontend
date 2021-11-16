import { each, forOwn } from 'lodash';
import { toast } from 'react-toastify';

const catchAxiosErrors = (err, loadingState) => {
  let msg = typeof err.response !== ("undefined" || null) ? err.response.data.message : err.message;
  console.debug("error", msg)
  if (loadingState) {
    loadingState(false);
  }

  if (Array.isArray(msg)) {
    each(msg, (val) => {
      toast.error(val, { autoClose: 6000 });
    });
  } else if (typeof msg === 'object') {
    forOwn(msg, (val, key) => {
      toast.error(val[0], { autoClose: 6000 });
      console.log(key, val[0])
    })
  } else if (typeof msg === 'string') {
    toast.error(msg, { autoClose: 6000 });  
  } else {
    toast.error(`An error occured, please try again.`);
  }
}

export default catchAxiosErrors;