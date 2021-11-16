import parkStaffAtom from './atom';
import { selector } from "recoil";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withParkStaffQuery = selector({
  key: 'withParkStaffQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/get-agents`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Staff State: ', get(parkStaffAtom));
        console.log('Actual Data: ', data?.agents);

        return data?.agents || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newStaff) => {
    set(parkStaffAtom, [...get(parkStaffAtom), newStaff]);
  },
});

export default withParkStaffQuery;