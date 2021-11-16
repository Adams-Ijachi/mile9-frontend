import { useResetRecoilState } from 'recoil';
import { parkAdminAtom} from './parkAdmin';

const clearRecoil = () => {
  try {
    useResetRecoilState(parkAdminAtom);
    console.log('RECOIL CLEARED: ', useResetRecoilState(parkAdminAtom));
  } catch (err) {
    console.error('CLEAR RECOIL: ', err)
  }
}

export default clearRecoil;