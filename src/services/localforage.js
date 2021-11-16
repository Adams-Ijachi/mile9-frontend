import localForage from "localforage";

localForage.config({
  driver: [
    localForage.INDEXEDDB,
    localForage.LOCALSTORAGE,
    localForage.WEBSQL,
  ],
  name: 'Mile9ine',
  version: 1.0,
  size: 4980736,
  storeName: '9ine_app_miledb',
  description: 'Mile9ine local forage store'
});

export default localForage;