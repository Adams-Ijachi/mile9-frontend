import { selector } from 'recoil';
import { pick, isEmpty } from 'lodash';
import parkAdminAtom from './atom';

const withParkAdmin = selector({
  key: 'withParkAdmin',
  get: ({get}) => {
    const data = get(parkAdminAtom);
    if (isEmpty(data)) {
      return {};
    }
    return pick(data, ['id', 'first_name', 'last_name', 'email']);
  },
  set: ({set}, newValue) => set(parkAdminAtom, newValue),
});

export default withParkAdmin;
