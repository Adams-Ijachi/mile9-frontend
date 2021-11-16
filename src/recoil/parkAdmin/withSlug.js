import { isEmpty } from "lodash";
import { selector } from "recoil";
import parkAdminAtom from "./atom";
import { slugify } from "../../utils";


const withParkSlug = selector({
  key: 'withParkSlug',
  get: ({ get }) => {
    const data = get(parkAdminAtom);

    if (isEmpty(data)) {
      return ``;
    }
    return slugify(data?.park.park_name);
  },
  set: ({ set }, newValue) => set(parkAdminAtom, newValue),
});

export default withParkSlug;