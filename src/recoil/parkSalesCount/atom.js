import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkSalesCountAtom = atom({
  key: 'parkSalesCountAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default parkSalesCountAtom;