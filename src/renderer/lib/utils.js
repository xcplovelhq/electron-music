import Moment from "moment";

export function getSum(num) {
  if (num > 100000) {
    return (num / 10000).toFixed(0) + "万";
  } else {
    return num;
  }
}

export function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}
export function getSingerName(item, idx) {
  if (idx > 0) {
    return " / " + item.name;
  } else {
    return item.name;
  }
}

export function getTime(time) {
  return Moment(time).format("YYYY-MM-DD");
}

export function debounce(fn, delay) {
  var timer;
  return function() {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}
export function throttle(fn, interval) {
  var last;
  var timer;
  return function() {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
}
