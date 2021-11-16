import { toast } from "react-toastify";
import { each, forOwn } from 'lodash';
import { postRequest } from "../utils/axiosClient";
import { getToken } from "../utils";
import localForage from "./localforage";
import clearRecoil from '../recoil/clearRecoil';

const logoutEntity = async (endpoint, router) => {
  try {
    const { data, status, statusText } = await postRequest(endpoint, null, {
      headers: {
        authorization: `Bearer ${await getToken()}`
      }
    });
    if (data) {
      console.log(data, status, statusText);

      localForage.clear().then(() => {
        clearRecoil();
        toast.success(`You've logged out successfully!`);
        router.push('/');
        console.log('Database is now empty.');
      }).catch((e) => {
        console.error(e)
      });
    }
  } catch (err) {
    let msg = typeof err.response !== (undefined || null) ? err?.response?.data?.message : err?.message;
    console.debug("error", msg);

    if (Array.isArray(msg)) {
      each(msg, (val) => {
        toast.error(val, { autoClose: 6000 });
      });
    } else if (typeof msg === 'object') {
      forOwn(msg, (val, key) => {
        toast.error(val[0], { autoClose: 6000 });
        console.log(key, val[0]);
      })
    } else if (typeof msg === 'string') {
      toast.error(msg, { autoClose: 6000 });  
    } else {
      toast.error(`An error occured, please try again.`);
    }
  }
}

export default logoutEntity;