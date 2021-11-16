import parkAgentAtom from "./atom";
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withAgentDetails = selector({
  key: 'withAgentDetails',
  get: ({get}) => {
    const data = get(parkAgentAtom);

    if (isEmpty(data)) {
      return {};
    }
    
    return pick(data?.agent, [
      'id',
      'user_id',
      'agent_wallet_amount',
      'agent_code',
      'slug',
      'park_id'
    ]);
  },
  set: ({set}, newValue) => set(parkAdminAtom, newValue),
});

export default withAgentDetails;