import promiseIpc from "electron-promise-ipc"; // yarn add electron-promise-ipc

const DISPATCH = "promise-action-dispatch";

export default (options = {}) => store => {
  console.log(options);

  function renderer() {
    store.dispatchPromise = (type, payload) =>
      promiseIpc.send(DISPATCH, {
        type,
        payload
      });
  }

  function main(store) {
    promiseIpc.on(DISPATCH, ({ type, payload }) => {
      return store.dispatch(type, payload);
    });
  }

  return process.type === "renderer" ? renderer() : main(store);
};
