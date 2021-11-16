import { selector } from "recoil";
import parkDriversAtom from "./atom";
import { getToken, catchAxiosErrors } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withParkDriversQuery = selector({
  key: 'withParkDriversQuery',
  get: async ({ get }) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/park-drivers`, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Drivers Atom State: ', get(parkDriversAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newDriver) => {
    set(parkDriversAtom, [...get(parkDriversAtom), newDriver]);
  },
});

export default withParkDriversQuery;