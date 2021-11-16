import { selector } from "recoil";
import parkBusesAtom from "./atom";
import { getToken, catchAxiosErrors } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withParkBusesQuery = selector({
  key: 'withParkBusesQuery',
  get: async ({ get }) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/park_buses`, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });
  
      if (data) {
        console.log(data, status, statusText);  
        console.log('Atom State: ', get(parkBusesAtom)); 
        return data?.data;
      }
      return [];
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({set, get}, newBus) => {
    set(parkBusesAtom, [...get(parkBusesAtom), newBus]);
  },
});

export default withParkBusesQuery;