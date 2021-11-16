import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkAgentAtom = atom({
  key: 'parkAgentAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default parkAgentAtom;