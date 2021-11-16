import parkAgentAtom from "./atom";
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withUserAgent = selector({
  key: 'withUserAgent',
  get: ({get}) => {
    const data = get(parkAgentAtom);

    if (isEmpty(data)) {
      return {};
    }

    return pick(data, [
      'id',
      'name',
      'email',
      'email_verified_at',
      'is_email_verified',
      'type'
    ]);
  },
  set: ({set}, newValue) => set(parkAgentAtom, newValue),
});

export default withUserAgent;