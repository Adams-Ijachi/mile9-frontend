import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'mile9ine-recoil-persist',
  storage: localStorage,
});

export default persistAtom;