import { selector } from "recoil";
import parkRidesAtom from './atom';
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withParkRidesQuery = selector({
  key: 'withParkRidesQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/rides`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Drivers Atom State: ', get(parkRidesAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newRide) => {
    set(parkRidesAtom, [...get(parkRidesAtom), newRide]);
  },
});

export default withParkRidesQuery;