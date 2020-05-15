import Store from "electron-store";

const store = new Store({
  watch: true
});
export function storage(name, data) {
  store.set(name, data);
}
export function getStorage(name) {
  return store.get(name);
}
export function deleteStorage(name) {
  store.delete(name);
}
export function onDidChange(name, fun) {
  console.log(store);

  store.onDidChange(name, fun);
}
export function onDidAnyChange(fun) {
  console.log(store);
  store.onDidAnyChange(fun);
}
