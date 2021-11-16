import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkRidesAtom = atom({
  key: 'parkRidesAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default parkRidesAtom;