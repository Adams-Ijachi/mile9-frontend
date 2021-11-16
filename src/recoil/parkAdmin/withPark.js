import parkAdminAtom from './atom';
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withPark = selector({
  key: 'withPark',
  get: ({get}) => {
    const data = get(parkAdminAtom);

    if (isEmpty(data)) {
      return {};
    }
    
    return pick(data?.park, ['id', 'park_name', 'park_address', 'park_city', 'park_state', 'park_zip', 'park_contact' ]);
  },
  set: ({set}, newValue) => set(parkAdminAtom, newValue),
});

export default withPark;