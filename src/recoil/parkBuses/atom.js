import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkBusesAtom = atom({
  key: 'parkBusesAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default parkBusesAtom;