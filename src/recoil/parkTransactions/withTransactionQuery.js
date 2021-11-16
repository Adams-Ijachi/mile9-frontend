import parkTransactionAtom from "./atom";
import { selector } from "recoil";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withTransactionQuery = selector({
  key: 'withTransactionQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_admin/park_transactions`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Transaction State: ', get(parkTransactionAtom));
        console.log('Actual Data: ', data?.data);

        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null);
    }
  },
  set: ({ set, get }, newTransaction) => {
    set(parkTransactionAtom, [...get(parkTransactionAtom), newTransaction]);
  },
});

export default withTransactionQuery;