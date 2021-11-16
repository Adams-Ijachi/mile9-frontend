import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkAdminAtom = atom({
  key: "parkAdminAtom",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default parkAdminAtom;