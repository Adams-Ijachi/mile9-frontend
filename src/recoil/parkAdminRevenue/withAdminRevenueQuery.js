import { selector } from "recoil";
import parkAdminRevenueAtom from "./atom";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withAdminRevenueQuery = selector({
  key: 'withAdminRevenueQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/get-booking-count/monthly`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log('Revenue State: ', get(parkAdminRevenueAtom));
        console.log('Actual Data: ', data?.data);

        return data?.data || '0'
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newRevenue) => {
    set(parkAdminRevenueAtom, [...get(parkAdminRevenueAtom), newRevenue]);
  },
});

export default withAdminRevenueQuery;