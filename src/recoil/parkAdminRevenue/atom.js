import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkAdminRevenueAtom = atom({
  key: 'parkAdminRevenueAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default parkAdminRevenueAtom;