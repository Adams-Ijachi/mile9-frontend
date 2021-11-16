import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const parkStaffAtom = atom({
  key: 'parkStaffAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default parkStaffAtom;