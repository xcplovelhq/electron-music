import Store from "electron-store";

const store = new Store();
export function storage(name, data) {
  store.set(name, data);
}
export function getStorage(name) {
  return store.get(name);
}
export function deleteStorage(name) {
  store.delete(name);
}
