import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkTransactionAtom = atom({
  key: 'parkTransactionAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default parkTransactionAtom;