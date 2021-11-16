import parkAdminAtom from './atom';
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withEmailAuth = selector({
  key: 'withEmailAuth',
  get: ({get}) => {
    const data = get(parkAdminAtom);
    if (isEmpty(data)) {
      return null;
    }
    return pick(data, 'email_verified_at');
  },
  set: ({set}, newValue) => set(parkAdminAtom, newValue),
});

export default withEmailAuth;