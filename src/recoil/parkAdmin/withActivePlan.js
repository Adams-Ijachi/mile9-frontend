import { selector } from "recoil";
import { pick, isEmpty } from 'lodash';
import parkAdminAtom from './atom';

const withActivePlan = selector({
  key: 'withActivePlan',
  get: ({get}) => {
    const data = get(parkAdminAtom);
    if (isEmpty(data)) {
      return false;
    }
    return pick(data?.park, 'park_payed')
  },
  set: ({set}, newValue) => set(parkAdminAtom, newValue),
});

export default withActivePlan;