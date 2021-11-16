import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkDriversAtom = atom({
  key: 'parkDriversAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default parkDriversAtom;
