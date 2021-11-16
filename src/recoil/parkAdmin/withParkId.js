import parkAdminAtom from "./atom";
import { pick, isEmpty } from 'lodash';
import { selector } from "recoil";

const withParkId = selector({
  key: 'withParkId',
  get: ({ get }) => {
    const data = get(parkAdminAtom);
    if (isEmpty(data)) {
      return null;
    }
    return pick(data, 'id');
  },
  set: ({ set }, newValue) => set(parkAdminAtom, newValue),
});

export default withParkId;