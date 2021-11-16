import { selector } from "recoil";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";
import parkSalesCountAtom from './atom';

const withSalesCountQuery = selector({
  key: 'withSalesCountQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/get-total-booking-sum`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Sales State: ', get(parkSalesCountAtom));
        console.log('Actual Data: ', data?.data);

        return data?.data || '0';
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newSalesCount) => {
    set(parkSalesCountAtom, [...get(parkSalesCountAtom), newSalesCount]);
  },
});

export default withSalesCountQuery;